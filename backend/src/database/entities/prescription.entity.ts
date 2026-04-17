import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';
import { Consultation } from './consultation.entity';

export enum PrescriptionStatus {
  ACTIVE = 'active',
  DISPENSED = 'dispensed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  prescriptionNumber: string;

  @ManyToOne(() => Consultation)
  @JoinColumn({ name: 'consultationId' })
  consultation: Consultation;

  @Column()
  consultationId: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column()
  doctorId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.ACTIVE,
  })
  status: PrescriptionStatus;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  validUntil: Date;

  @Column({ nullable: true })
  qrCodeUrl: string;

  @Column({ nullable: true })
  pdfUrl: string;

  @Column({ nullable: true })
  digitalSignature: string;

  @Column({ nullable: true })
  dispensedAt: Date;

  @Column({ nullable: true })
  dispensedPharmacy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('prescription_items')
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prescription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prescriptionId' })
  prescription: Prescription;

  @Column()
  prescriptionId: string;

  @Column()
  genericName: string;

  @Column({ nullable: true })
  brandName: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column()
  duration: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ default: false })
  isDispensed: boolean;
}