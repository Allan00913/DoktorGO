import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ConsultationType, ConsultationStatus } from '../../../database/entities/consultation.entity';

export class CreateConsultationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @ApiProperty()
  @IsUUID()
  doctorId: string;

  @ApiProperty()
  @IsUUID()
  patientId: string;

  @ApiProperty({ enum: ConsultationType })
  @IsEnum(ConsultationType)
  type: ConsultationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  chiefComplaint?: string;
}

export class CompleteConsultationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  followUpDate?: string;
}