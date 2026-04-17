import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../database/entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async findById(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async findByUserId(userId: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }
    return patient;
  }

  async create(data: Partial<Patient>): Promise<Patient> {
    const patient = this.patientsRepository.create(data);
    return this.patientsRepository.save(patient);
  }

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    const patient = await this.findById(id);
    Object.assign(patient, data);
    return this.patientsRepository.save(patient);
  }

  async verifyPatient(id: string): Promise<Patient> {
    return this.update(id, { isVerified: true });
  }

  async updateMedicalInfo(
    id: string,
    data: { allergies?: string[]; chronicConditions?: string[] },
  ): Promise<Patient> {
    const patient = await this.findById(id);
    if (data.allergies) patient.allergies = data.allergies;
    if (data.chronicConditions) patient.chronicConditions = data.chronicConditions;
    return this.patientsRepository.save(patient);
  }
}