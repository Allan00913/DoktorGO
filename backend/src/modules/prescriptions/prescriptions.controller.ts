import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/prescriptions.dto';
import { PrescriptionStatus } from '../../database/entities/prescription.entity';

@ApiTags('Prescriptions')
@Controller('prescriptions')
@ApiBearerAuth()
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all prescriptions with filters' })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: PrescriptionStatus,
  ) {
    return this.prescriptionsService.findAll({ patientId, doctorId, status });
  }

  @Get('verify/:prescriptionNumber')
  @ApiOperation({ summary: 'Verify prescription by number' })
  async verify(@Param('prescriptionNumber') prescriptionNumber: string) {
    return this.prescriptionsService.verify(prescriptionNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription by ID' })
  async findOne(@Param('id') id: string) {
    return this.prescriptionsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create prescription' })
  async create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    const data: any = { ...createPrescriptionDto };
    if (createPrescriptionDto.validUntil) {
      data.validUntil = new Date(createPrescriptionDto.validUntil);
    }
    return this.prescriptionsService.create(data);
  }

  @Put(':id/dispense')
  @ApiOperation({ summary: 'Mark prescription as dispensed' })
  async dispense(@Param('id') id: string, @Body('pharmacyName') pharmacyName: string) {
    return this.prescriptionsService.dispense(id, pharmacyName);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient prescriptions' })
  async getPatientPrescriptions(@Param('patientId') patientId: string) {
    return this.prescriptionsService.getPatientPrescriptions(patientId);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get doctor prescriptions' })
  async getDoctorPrescriptions(@Param('doctorId') doctorId: string) {
    return this.prescriptionsService.getDoctorPrescriptions(doctorId);
  }
}