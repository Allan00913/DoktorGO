import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription, PrescriptionItem, PrescriptionStatus } from '../../database/entities/prescription.entity';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private prescriptionItemsRepository: Repository<PrescriptionItem>,
  ) {}

  private generatePrescriptionNumber(): string {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `DGO-${uuid}`;
  }

  async findAll(filters?: {
    patientId?: string;
    doctorId?: string;
    status?: PrescriptionStatus;
  }): Promise<Prescription[]> {
    const query = this.prescriptionsRepository.createQueryBuilder('prescription')
      .leftJoinAndSelect('prescription.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('prescription.patient', 'patient')
      .leftJoinAndSelect('prescription.items', 'items');

    if (filters?.patientId) {
      query.andWhere('prescription.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.doctorId) {
      query.andWhere('prescription.doctorId = :doctorId', { doctorId: filters.doctorId });
    }
    if (filters?.status) {
      query.andWhere('prescription.status = :status', { status: filters.status });
    }

    return query.orderBy('prescription.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id },
      relations: ['doctor', 'doctor.user', 'patient', 'patient.user', 'items'],
    });
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    return prescription;
  }

  async findByPrescriptionNumber(prescriptionNumber: string): Promise<Prescription> {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { prescriptionNumber },
      relations: ['doctor', 'doctor.user', 'patient', 'patient.user', 'items'],
    });
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    return prescription;
  }

  async create(data: {
    consultationId: string;
    doctorId: string;
    patientId: string;
    diagnosis?: string;
    notes?: string;
    validUntil?: Date;
    items: {
      genericName: string;
      brandName?: string;
      dosage: string;
      frequency: string;
      duration: string;
      quantity?: number;
      instructions?: string;
    }[];
  }): Promise<Prescription> {
    const prescriptionNumber = this.generatePrescriptionNumber();
    const qrCodeUrl = `https://api.doktorgo.ph/verify/${prescriptionNumber}`;

    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
    } catch (e) {
      console.error('QR Code generation failed:', e);
    }

    const prescription = this.prescriptionsRepository.create({
      prescriptionNumber,
      consultationId: data.consultationId,
      doctorId: data.doctorId,
      patientId: data.patientId,
      diagnosis: data.diagnosis,
      notes: data.notes,
      validUntil: data.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      qrCodeUrl: qrCodeDataUrl,
      status: PrescriptionStatus.ACTIVE,
    });

    const savedPrescription = await this.prescriptionsRepository.save(prescription);

    const items = data.items.map(item =>
      this.prescriptionItemsRepository.create({
        prescriptionId: savedPrescription.id,
        ...item,
      }),
    );
    await this.prescriptionItemsRepository.save(items);

    return savedPrescription;
  }

  async update(id: string, data: Partial<Prescription>): Promise<Prescription> {
    const prescription = await this.findById(id);
    Object.assign(prescription, data);
    return this.prescriptionsRepository.save(prescription);
  }

  async dispense(id: string, pharmacyName: string): Promise<Prescription> {
    return this.update(id, {
      status: PrescriptionStatus.DISPENSED,
      dispensedAt: new Date(),
      dispensedPharmacy: pharmacyName,
    });
  }

  async verify(prescriptionNumber: string): Promise<{ valid: boolean; prescription?: Prescription }> {
    try {
      const prescription = await this.findByPrescriptionNumber(prescriptionNumber);
      return {
        valid: prescription.status === PrescriptionStatus.ACTIVE,
        prescription,
      };
    } catch {
      return { valid: false };
    }
  }

  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    return this.findAll({ patientId });
  }

  async getDoctorPrescriptions(doctorId: string): Promise<Prescription[]> {
    return this.findAll({ doctorId });
  }
}