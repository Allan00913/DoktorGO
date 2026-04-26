import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from '../../database/entities/consultation.entity';
import { ConsultationsService } from './consultations.service';
import { VideoService } from './video.service';
import { ConsultationsController } from './consultations.controller';
import { DoctorsModule } from '../doctors/doctors.module';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation]),
    forwardRef(() => DoctorsModule),
    forwardRef(() => PatientsModule),
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService, VideoService],
  exports: [ConsultationsService, VideoService],
})
export class ConsultationsModule {}