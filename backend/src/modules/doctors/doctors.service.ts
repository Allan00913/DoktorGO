import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../database/entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async findAll(filters?: {
    specialty?: string;
    language?: string;
    isAvailable?: boolean;
  }): Promise<Doctor[]> {
    const query = this.doctorsRepository.createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user');

    if (filters?.specialty) {
      query.andWhere('doctor.specialty = :specialty', { specialty: filters.specialty });
    }
    if (filters?.language) {
      query.andWhere(':language = ANY(doctor.languages)', { language: filters.language });
    }
    if (filters?.isAvailable !== undefined) {
      query.andWhere('doctor.isAvailable = :isAvailable', { isAvailable: filters.isAvailable });
    }

    return query.getMany();
  }

  async findById(id: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }

  async findByUserId(userId: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }
    return doctor;
  }

  async create(data: Partial<Doctor>): Promise<Doctor> {
    const existingDoctor = await this.doctorsRepository.findOne({
      where: { prcLicenseNumber: data.prcLicenseNumber },
    });
    if (existingDoctor) {
      throw new ConflictException('Doctor with this PRC license already exists');
    }
    const doctor = this.doctorsRepository.create(data);
    return this.doctorsRepository.save(doctor);
  }

  async update(id: string, data: Partial<Doctor>): Promise<Doctor> {
    const doctor = await this.findById(id);
    Object.assign(doctor, data);
    return this.doctorsRepository.save(doctor);
  }

  async verifyDoctor(id: string): Promise<Doctor> {
    return this.update(id, { isVerified: true });
  }

  async setAvailability(id: string, isAvailable: boolean): Promise<Doctor> {
    return this.update(id, { isAvailable });
  }

  async getAvailableDoctors(specialty?: string): Promise<Doctor[]> {
    return this.findAll({ specialty, isAvailable: true });
  }

  async searchBySymptom(symptom: string): Promise<Doctor[]> {
    return this.doctorsRepository.createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .where('doctor.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere('doctor.specialty ILIKE :symptom', { symptom: `%${symptom}%` })
      .orWhere('doctor.subspecialty ILIKE :symptom', { symptom: `%${symptom}%` })
      .getMany();
  }
}