import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ unique: true })
  prcLicenseNumber: string;

  @Column()
  ptrNumber: string;

  @Column({ nullable: true })
  prcLicenseImage: string;

  @Column({ nullable: true })
  ptrImage: string;

  @Column()
  specialty: string;

  @Column({ nullable: true })
  subspecialty: string;

  @Column({ type: 'text', array: true, nullable: true })
  languages: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  consultationFee: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isAvailable: boolean;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  hospitalAffiliation: string;

  @Column({ type: 'simple-array', nullable: true })
  availableDays: string[];

  @Column({ nullable: true })
  startTime: string;

  @Column({ nullable: true })
  endTime: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalConsultations: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}