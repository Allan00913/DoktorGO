import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

export interface GCashPaymentRequest {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface GCashPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  checkoutUrl?: string;
  qrCode?: string;
  expiresAt?: Date;
}

export interface GCashStatusResponse {
  id: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  amount: number;
  currency: string;
  transactionId?: string;
  paidAt?: Date;
}

@Injectable()
export class GCashService {
  private clientId: string;
  private clientSecret: string;
  private merchantId: string;
  private publicKey: string;
  private privateKey: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get('GCASH_CLIENT_ID') || '';
    this.clientSecret = this.configService.get('GCASH_CLIENT_SECRET') || '';
    this.merchantId = this.configService.get('GCASH_MERCHANT_ID') || '';
    this.publicKey = this.configService.get('GCASH_PUBLIC_KEY') || '';
    this.privateKey = this.configService.get('GCASH_PRIVATE_KEY') || '';
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://gcash://api.gcash.com/v1' 
      : 'https://api.gcash.com/v1';
  }

  async createPayment(request: GCashPaymentRequest): Promise<GCashPaymentResponse> {
    const { amount, currency = 'PHP', description, metadata } = request;

    const paymentData = {
      amount: {
        value: Math.round(amount * 100),
        currency,
      },
      descriptor: {
        name: description || 'DoktorGO Consultation',
      },
      referenceId: uuidv4(),
      metadata: metadata || {},
    };

    const response = await this.makeRequest('/checkout/v1/payments', paymentData);

    return {
      id: response.id,
      status: response.status,
      amount: response.amount.value / 100,
      currency: response.amount.currency,
      checkoutUrl: response.actions?.find((a: any) => a.name === 'redirect')?.url,
      qrCode: response.actions?.find((a: any) => a.name === 'qr')?.qrCode?.value,
      expiresAt: new Date(response.expiryDate),
    };
  }

  async getPaymentStatus(paymentId: string): Promise<GCashStatusResponse> {
    const response = await this.makeRequest(`/checkout/v1/payments/${paymentId}`, {}, 'GET');

    return {
      id: response.id,
      status: response.status,
      amount: response.amount.value / 100,
      currency: response.amount.currency,
      transactionId: response.transactionId,
      paidAt: response.payoutDate ? new Date(response.payoutDate) : undefined,
    };
  }

  async checkPayment(paymentIdOrRef: string): Promise<GCashPaymentResponse | null> {
    try {
      return await this.getPaymentStatus(paymentIdOrRef);
    } catch (error) {
      return null;
    }
  }

  private async makeRequest(
    endpoint: string,
    body: any,
    method: string = 'POST',
  ): Promise<any> {
    const accessToken = await this.getAccessToken();

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'GCash API request failed');
    }

    return response.json();
  }

  private async getAccessToken(): Promise<string> {
    const url = `${this.baseUrl}/oauth/token`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with GCash');
    }

    const data = await response.json();
    return data.access_token;
  }

  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret && this.merchantId);
  }
}