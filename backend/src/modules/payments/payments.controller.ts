import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { GCashService } from './gcash.service';
import { CreatePaymentDto } from './dto/payments.dto';
import { PaymentStatus, PaymentMethod } from '../../database/entities/payment.entity';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private gcashService: GCashService,
  ) {}

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

  @Post('gcash/checkout')
  @ApiOperation({ summary: 'Create GCash payment' })
  async createGCashPayment(
    @Body() body: { amount: number; description?: string; metadata?: Record<string, any> },
  ) {
    if (!this.gcashService.isConfigured()) {
      return {
        error: 'GCash not configured',
        message: 'Add GCASH_CLIENT_ID, GCASH_CLIENT_SECRET to environment',
        method: 'mock',
        mockData: {
          id: 'mock_' + Date.now(),
          status: 'pending',
          amount: body.amount,
          currency: 'PHP',
          checkoutUrl: 'gcash://mock',
        },
      };
    }
    return this.gcashService.createPayment({
      amount: body.amount,
      description: body.description,
      metadata: body.metadata,
    });
  }

  @Get('gcash/status/:paymentId')
  @ApiOperation({ summary: 'Get GCash payment status' })
  async getGCashStatus(@Param('paymentId') paymentId: string) {
    return this.gcashService.getPaymentStatus(paymentId);
  }

  @Get('gcash/check')
  @ApiOperation({ summary: 'Check GCash configuration' })
  async checkGCash() {
    return {
      configured: this.gcashService.isConfigured(),
    };
  }
}