import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/payments.dto';
import { PaymentStatus, PaymentMethod } from '../../database/entities/payment.entity';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payments with filters' })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('status') status?: PaymentStatus,
    @Query('method') method?: PaymentMethod,
  ) {
    return this.paymentsService.findAll({ patientId, status, method });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  @Get('transaction/:transactionId')
  @ApiOperation({ summary: 'Get payment by transaction ID' })
  async findByTransactionId(@Param('transactionId') transactionId: string) {
    return this.paymentsService.findByTransactionId(transactionId);
  }

  @Post()
  @ApiOperation({ summary: 'Create payment' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Mark payment as completed' })
  async complete(@Param('id') id: string, @Body('referenceNumber') referenceNumber?: string) {
    return this.paymentsService.markAsCompleted(id, referenceNumber);
  }

  @Put(':id/fail')
  @ApiOperation({ summary: 'Mark payment as failed' })
  async fail(@Param('id') id: string, @Body('reason') reason: string) {
    return this.paymentsService.markAsFailed(id, reason);
  }

  @Put(':id/refund')
  @ApiOperation({ summary: 'Process refund' })
  async refund(@Param('id') id: string) {
    return this.paymentsService.processRefund(id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get patient payments' })
  async getPatientPayments(@Param('patientId') patientId: string) {
    return this.paymentsService.getPatientPayments(patientId);
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Get payment statistics' })
  async getStats(@Query('patientId') patientId?: string) {
    return this.paymentsService.getPaymentStats(patientId);
  }
}