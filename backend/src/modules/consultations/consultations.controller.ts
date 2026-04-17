import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto, CompleteConsultationDto } from './dto/consultations.dto';
import { ConsultationStatus } from '../../database/entities/consultation.entity';

@ApiTags('Consultations')
@Controller('consultations')
@ApiBearerAuth()
export class ConsultationsController {
  constructor(private consultationsService: ConsultationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all consultations with filters' })
  async findAll(
    @Query('doctorId') doctorId?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: ConsultationStatus,
  ) {
    return this.consultationsService.findAll({ doctorId, patientId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consultation by ID' })
  async findOne(@Param('id') id: string) {
    return this.consultationsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create consultation' })
  async create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(createConsultationDto);
  }

  @Put(':id/start')
  @ApiOperation({ summary: 'Start consultation' })
  async startConsultation(@Param('id') id: string) {
    return this.consultationsService.startConsultation(id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete consultation' })
  async completeConsultation(
    @Param('id') id: string,
    @Body() completeConsultationDto: CompleteConsultationDto,
  ) {
    const data: any = { ...completeConsultationDto };
    if (completeConsultationDto.followUpDate) {
      data.followUpDate = new Date(completeConsultationDto.followUpDate);
    }
    return this.consultationsService.completeConsultation(id, data);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient consultations' })
  async getPatientConsultations(@Param('patientId') patientId: string) {
    return this.consultationsService.getPatientConsultations(patientId);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get doctor consultations' })
  async getDoctorConsultations(@Param('doctorId') doctorId: string) {
    return this.consultationsService.getDoctorConsultations(doctorId);
  }
}