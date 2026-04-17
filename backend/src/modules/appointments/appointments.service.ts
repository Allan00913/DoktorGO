import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus, AppointmentType } from '../../database/entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async findAll(filters?: {
    doctorId?: string;
    patientId?: string;
    status?: AppointmentStatus;
    date?: Date | string;
  }): Promise<Appointment[]> {
    const query = this.appointmentsRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser');

    if (filters?.doctorId) {
      query.andWhere('appointment.doctorId = :doctorId', { doctorId: filters.doctorId });
    }
    if (filters?.patientId) {
      query.andWhere('appointment.patientId = :patientId', { patientId: filters.patientId });
    }
    if (filters?.status) {
      query.andWhere('appointment.status = :status', { status: filters.status });
    }
    if (filters?.date) {
      const dateObj = typeof filters.date === 'string' ? new Date(filters.date) : filters.date;
      const startOfDay = new Date(dateObj);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateObj);
      endOfDay.setHours(23, 59, 59, 999);
      query.andWhere('appointment.scheduledDate BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      });
    }

    return query.orderBy('appointment.scheduledDate', 'ASC').getMany();
  }

  async findById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor', 'doctor.user', 'patient', 'patient.user'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async create(data: any): Promise<Appointment> {
    const appointmentData: any = { ...data };
    if (data.scheduledDate && typeof data.scheduledDate === 'string') {
      appointmentData.scheduledDate = new Date(data.scheduledDate);
    }
    if (appointmentData.type === AppointmentType.SCHEDULED && appointmentData.scheduledDate && appointmentData.doctorId) {
      const queuePosition = await this.getQueuePosition(appointmentData.doctorId, appointmentData.scheduledDate);
      appointmentData.queuePosition = queuePosition;
    }
    const appointment = this.appointmentsRepository.create(appointmentData);
    return this.appointmentsRepository.save(appointment) as unknown as Promise<Appointment>;
  }

  private async getQueuePosition(doctorId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await this.appointmentsRepository.count({
      where: {
        doctorId,
        scheduledDate: Between(startOfDay, endOfDay),
        status: AppointmentStatus.PENDING,
      },
    });
    return count + 1;
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const appointment = await this.findById(id);
    Object.assign(appointment, data);
    return this.appointmentsRepository.save(appointment);
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return this.update(id, { status });
  }

  async cancel(id: string, reason?: string): Promise<Appointment> {
    return this.update(id, { status: AppointmentStatus.CANCELLED, notes: reason });
  }

  async getDoctorQueue(doctorId: string, date: Date): Promise<Appointment[]> {
    return this.findAll({ doctorId, date, status: AppointmentStatus.PENDING });
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    return this.findAll({ patientId });
  }

  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    return this.findAll({ doctorId });
  }
}