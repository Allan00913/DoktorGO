import { Injectable } from '@nestjs/common';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'payment' | 'general';
  data?: any;
}

@Injectable()
export class NotificationsService {
  private notifications: NotificationPayload[] = [];

  async sendPushNotification(payload: NotificationPayload): Promise<boolean> {
    console.log(`Sending push notification to ${payload.userId}: ${payload.title}`);
    this.notifications.push(payload);
    return true;
  }

  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
    return true;
  }

  async sendEmail(email: string, subject: string, body: string): Promise<boolean> {
    console.log(`Sending email to ${email}: ${subject}`);
    return true;
  }

  async notifyAppointmentReminder(userId: string, appointmentDetails: any): Promise<boolean> {
    return this.sendPushNotification({
      userId,
      title: 'Appointment Reminder',
      message: `Your appointment is scheduled for ${appointmentDetails.date}`,
      type: 'appointment',
      data: appointmentDetails,
    });
  }

  async notifyPrescriptionReady(userId: string, prescriptionDetails: any): Promise<boolean> {
    return this.sendPushNotification({
      userId,
      title: 'Prescription Ready',
      message: 'Your prescription is ready for pickup',
      type: 'prescription',
      data: prescriptionDetails,
    });
  }

  async notifyPaymentSuccess(userId: string, paymentDetails: any): Promise<boolean> {
    return this.sendPushNotification({
      userId,
      title: 'Payment Successful',
      message: `Your payment of ₱${paymentDetails.amount} was successful`,
      type: 'payment',
      data: paymentDetails,
    });
  }

  getUserNotifications(userId: string): NotificationPayload[] {
    return this.notifications.filter(n => n.userId === userId);
  }
}