import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  prcLicenseNumber: string;

  @ApiProperty()
  @IsString()
  ptrNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  prcLicenseImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ptrImage?: string;

  @ApiProperty()
  @IsString()
  specialty: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subspecialty?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  languages?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  consultationFee?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hospitalAffiliation?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  availableDays?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endTime?: string;
}

export class UpdateDoctorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subspecialty?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  languages?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  consultationFee?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hospitalAffiliation?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  availableDays?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class DoctorFiltersDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}