import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation, ConsultationStatus, ConsultationType } from '../../database/entities/consultation.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private consultationsRepository: Repository<Consultation>,
  ) {}

  async findAll(filters?: {
    doctorId?: string;
    patientId?: string;
    status?: ConsultationStatus;
  }): Promise<Consultation[]> {
    const query = this.consultationsRepository.createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('consultation.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser');

    if (filters?.doctorId) {
      query.andWhere('consultation.doctorId = :doctorId', { doctorId: filters.doctorId });
    }
    if (filters?.patientId) {
      query.andWhere('consultation.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.status) {
      query.andWhere('consultation.status = :status', { status: filters.status });
    }

    return query.orderBy('consultation.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Consultation> {
    const consultation = await this.consultationsRepository.findOne({
      where: { id },
      relations: ['doctor', 'doctor.user', 'patient', 'patient.user', 'appointment'],
    });
    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }
    return consultation;
  }

  async create(data: Partial<Consultation>): Promise<Consultation> {
    const roomId = `room-${uuidv4()}`;
    const consultation = this.consultationsRepository.create({
      ...data,
      roomId,
    });
    return this.consultationsRepository.save(consultation);
  }

  async update(id: string, data: Partial<Consultation>): Promise<Consultation> {
    const consultation = await this.findById(id);
    Object.assign(consultation, data);
    return this.consultationsRepository.save(consultation);
  }

  async startConsultation(id: string): Promise<Consultation> {
    return this.update(id, {
      status: ConsultationStatus.IN_PROGRESS,
      startTime: new Date(),
    });
  }

  async completeConsultation(
    id: string,
    data: { diagnosis?: string; notes?: string; followUpDate?: Date },
  ): Promise<Consultation> {
    return this.update(id, {
      status: ConsultationStatus.COMPLETED,
      endTime: new Date(),
      diagnosis: data.diagnosis,
      notes: data.notes,
      followUpDate: data.followUpDate,
    });
  }

  async getPatientConsultations(patientId: string): Promise<Consultation[]> {
    return this.findAll({ patientId });
  }

  async getDoctorConsultations(doctorId: string): Promise<Consultation[]> {
    return this.findAll({ doctorId });
  }

  async getActiveConsultation(patientId: string, doctorId: string): Promise<Consultation | null> {
    return this.consultationsRepository.findOne({
      where: {
        patientId,
        doctorId,
        status: ConsultationStatus.IN_PROGRESS,
      },
    });
  }
}