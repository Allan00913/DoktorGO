import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import * as crypto_js from 'crypto-js';

export interface VideoRoomResponse {
  roomId: string;
  token: string;
  channelName: string;
  appointmentId: string;
  expiresAt: Date;
}

@Injectable()
export class VideoService {
  private appId: string;
  private appCertificate: string;
  private serverId: string;
  private serverSecret: string;

  constructor(private configService: ConfigService) {
    this.appId = this.configService.get('AGORA_APP_ID') || '';
    this.appCertificate = this.configService.get('AGORA_APP_CERTIFICATE') || '';
    this.serverId = this.configService.get('AGORA_SERVER_ID') || '';
    this.serverSecret = this.configService.get('AGORA_SERVER_SECRET') || '';
  }

  async createRoom(appointmentId: string, doctorId: string, patientId: string): Promise<VideoRoomResponse> {
    const roomId = uuidv4().substring(0, 8).toUpperCase();
    const channelName = appointmentId || `instant-${roomId}`;
    
    let token = '';
    
    if (this.appId && this.appCertificate) {
      token = this.generateAgoraToken(channelName, roomId);
    } else {
      token = this.generateMockToken(channelName);
    }

    return {
      roomId,
      token,
      channelName,
      appointmentId,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    };
  }

  async getRoomInfo(roomId: string): Promise<any> {
    return {
      roomId,
      status: 'active',
      message: 'Room is active',
    };
  }

  async endRoom(roomId: string): Promise<any> {
    return {
      roomId,
      status: 'ended',
      message: 'Room ended successfully',
    };
  }

  private generateAgoraToken(channelName: string, uid: string): string {
    // Agora token v3 format using HMAC-SHA256
    const version = '003';
    const issueTime = Math.floor(Date.now() / 1000);
    const expireTime = issueTime + 3600;
    const randomStr = Math.floor(Math.random() * 100000).toString();
    
    // Signature: appId + channelName + randomStr + expireTime
    const signatureStr = this.appId + channelName + randomStr + expireTime.toString();
    const signature = crypto_js.HmacSHA256(signatureStr, this.appCertificate);
    const signatureHex = signature.toString(crypto_js.enc.Hex);
    
    // Build token object
    const tokenData = {
      ver: version,
      app_id: this.appId,
      random_str: randomStr,
      expire_time: expireTime,
      signature: signatureHex,
    };
    
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
  }

  private generateMockToken(channelName: string): string {
    return `demo_token_${channelName}_${Date.now()}`;
  }

  isConfigured(): boolean {
    return !!(this.appId && this.appCertificate);
  }
}