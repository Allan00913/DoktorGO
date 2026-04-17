import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patients.dto';

@ApiTags('Patients')
@Controller('patients')
@ApiBearerAuth()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  async findOne(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create patient profile' })
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update patient profile' })
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify patient' })
  async verify(@Param('id') id: string) {
    return this.patientsService.verifyPatient(id);
  }

  @Put(':id/medical-info')
  @ApiOperation({ summary: 'Update medical information' })
  async updateMedicalInfo(
    @Param('id') id: string,
    @Body() data: { allergies?: string[]; chronicConditions?: string[] },
  ) {
    return this.patientsService.updateMedicalInfo(id, data);
  }
}