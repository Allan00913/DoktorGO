import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentFiltersDto } from './dto/appointments.dto';
import { AppointmentStatus } from '../../database/entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all appointments with filters' })
  async findAll(@Query() filters: AppointmentFiltersDto) {
    const filterData: any = { ...filters };
    if (filters.date) {
      filterData.date = new Date(filters.date);
    }
    return this.appointmentsService.findAll(filterData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create appointment' })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update appointment' })
  async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    const updateData: any = { ...updateAppointmentDto };
    if (updateAppointmentDto.scheduledDate) {
      updateData.scheduledDate = new Date(updateAppointmentDto.scheduledDate);
    }
    return this.appointmentsService.update(id, updateData);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  async updateStatus(@Param('id') id: string, @Body('status') status: AppointmentStatus) {
    return this.appointmentsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel appointment' })
  async cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.appointmentsService.cancel(id, reason);
  }

  @Get('doctor/:doctorId/queue')
  @ApiOperation({ summary: 'Get doctor appointment queue' })
  async getDoctorQueue(@Param('doctorId') doctorId: string, @Query('date') date: string) {
    return this.appointmentsService.getDoctorQueue(doctorId, new Date(date));
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient appointments' })
  async getPatientAppointments(@Param('patientId') patientId: string) {
    return this.appointmentsService.getPatientAppointments(patientId);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get doctor appointments' })
  async getDoctorAppointments(@Param('doctorId') doctorId: string) {
    return this.appointmentsService.getDoctorAppointments(doctorId);
  }
}