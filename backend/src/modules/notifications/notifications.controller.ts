import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService, NotificationPayload } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send notification' })
  async sendNotification(@Body() payload: NotificationPayload) {
    return this.notificationsService.sendPushNotification(payload);
  }

  @Post('sms')
  @ApiOperation({ summary: 'Send SMS' })
  async sendSms(@Body() data: { phoneNumber: string; message: string }) {
    return this.notificationsService.sendSMS(data.phoneNumber, data.message);
  }

  @Post('email')
  @ApiOperation({ summary: 'Send email' })
  async sendEmail(@Body() data: { email: string; subject: string; body: string }) {
    return this.notificationsService.sendEmail(data.email, data.subject, data.body);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user notifications' })
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }
}