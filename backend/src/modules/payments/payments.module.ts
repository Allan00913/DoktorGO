import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../database/entities/payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { GCashService } from './gcash.service';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    forwardRef(() => PatientsModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, GCashService],
  exports: [PaymentsService, GCashService],
})
export class PaymentsModule {}