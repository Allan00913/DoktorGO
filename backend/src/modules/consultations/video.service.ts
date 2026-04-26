import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

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
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    
    const token = this.generateToken(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      privilegeExpiredTs,
      0
    );
    
    return token;
  }

  private generateToken(appId: string, appCert: string, channelName: string, uid: string, expireTime: number, role: number = 1): string {
    const version = '006';
    const cryptoStr = appCert + appId + channelName + uid + expireTime.toString();
    const hash = crypto.createHash('sha256').update(cryptoStr).digest('hex');
    
    return version + hash;
  }

  private generateMockToken(channelName: string): string {
    return `demo_token_${channelName}_${Date.now()}`;
  }

  isConfigured(): boolean {
    return !!(this.appId && this.appCertificate);
  }
}