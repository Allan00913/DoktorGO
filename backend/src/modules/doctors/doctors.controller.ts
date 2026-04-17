import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto, DoctorFiltersDto } from './dto/doctors.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all doctors with filters' })
  async findAll(@Query() filters: DoctorFiltersDto) {
    return this.doctorsService.findAll(filters);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search doctors by name or specialty' })
  async search(
    @Query('q') query?: string,
    @Query('specialty') specialty?: string,
    @Query('language') language?: string,
    @Query('available') isAvailable?: boolean,
  ) {
    return this.doctorsService.searchDoctors({ query, specialty, language, isAvailable });
  }

  @Get('specialties')
  @ApiOperation({ summary: 'Get all specialties' })
  async getSpecialties() {
    return this.doctorsService.getSpecialties();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available doctors' })
  async getAvailable(@Query('specialty') specialty?: string) {
    return this.doctorsService.getAvailableDoctors(specialty);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search doctors by symptom' })
  async search(@Query('symptom') symptom: string) {
    return this.doctorsService.searchBySymptom(symptom);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get doctor availability schedule' })
  async getSchedule(@Param('id') id: string, @Query('date') date?: string) {
    return this.doctorsService.getDoctorSchedule(id, date);
  }

  @Post()
  @ApiOperation({ summary: 'Create doctor profile' })
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update doctor profile' })
  async update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify doctor (admin only)' })
  async verify(@Param('id') id: string) {
    return this.doctorsService.verifyDoctor(id);
  }

  @Put(':id/availability')
  @ApiOperation({ summary: 'Set doctor availability' })
  async setAvailability(@Param('id') id: string, @Body('isAvailable') isAvailable: boolean) {
    return this.doctorsService.setAvailability(id, isAvailable);
  }

  @Put(':id/schedule')
  @ApiOperation({ summary: 'Update doctor schedule' })
  async updateSchedule(
    @Param('id') id: string,
    @Body() schedule: { availableDays?: string[]; startTime?: string; endTime?: string },
  ) {
    return this.doctorsService.updateSchedule(id, schedule);
  }
}