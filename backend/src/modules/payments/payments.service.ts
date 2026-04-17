import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod, PaymentType } from '../../database/entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
  }

  async findAll(filters?: {
    patientId?: string;
    status?: PaymentStatus;
    method?: PaymentMethod;
  }): Promise<Payment[]> {
    const query = this.paymentsRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser');

    if (filters?.patientId) {
      query.andWhere('payment.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.status) {
      query.andWhere('payment.status = :status', { status: filters.status });
    }
    if (filters?.method) {
      query.andWhere('payment.method = :method', { method: filters.method });
    }

    return query.orderBy('payment.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['patient', 'patient.user', 'appointment'],
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async findByTransactionId(transactionId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { transactionId },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async create(data: {
    patientId: string;
    appointmentId?: string;
    type: PaymentType;
    method: PaymentMethod;
    amount: number;
    currency?: string;
  }): Promise<Payment> {
    const platformFee = data.amount * 0.05;
    const netAmount = data.amount - platformFee;

    const payment = this.paymentsRepository.create({
      transactionId: this.generateTransactionId(),
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      type: data.type,
      method: data.method,
      amount: data.amount,
      platformFee,
      netAmount,
      currency: data.currency || 'PHP',
      status: PaymentStatus.PENDING,
    });

    return this.paymentsRepository.save(payment);
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    const payment = await this.findById(id);
    Object.assign(payment, data);
    return this.paymentsRepository.save(payment);
  }

  async markAsCompleted(id: string, referenceNumber?: string): Promise<Payment> {
    return this.update(id, {
      status: PaymentStatus.COMPLETED,
      referenceNumber,
      paidAt: new Date(),
    });
  }

  async markAsFailed(id: string, reason: string): Promise<Payment> {
    return this.update(id, {
      status: PaymentStatus.FAILED,
      failureReason: reason,
      failedAt: new Date(),
    });
  }

  async processRefund(id: string): Promise<Payment> {
    return this.update(id, {
      status: PaymentStatus.REFUNDED,
      refundedAt: new Date(),
    });
  }

  async getPatientPayments(patientId: string): Promise<Payment[]> {
    return this.findAll({ patientId });
  }

  async getPaymentStats(patientId?: string): Promise<{ total: number; completed: number; pending: number }> {
    const query = this.paymentsRepository.createQueryBuilder('payment');
    
    if (patientId) {
      query.where('payment.patientId = :patientId', { patientId });
    }

    const total = await query.getCount();
    const completed = await query.clone().where('payment.status = :status', { status: PaymentStatus.COMPLETED }).getCount();
    const pending = await query.clone().where('payment.status = :status', { status: PaymentStatus.PENDING }).getCount();

    return { total, completed, pending };
  }
}