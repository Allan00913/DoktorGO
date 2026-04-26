import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

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

  constructor(private configService: ConfigService) {
    this.appId = this.configService.get('AGORA_APP_ID') || '';
    this.appCertificate = this.configService.get('AGORA_APP_CERTIFICATE') || '';
  }

  async createRoom(appointmentId: string, doctorId: string, patientId: string): Promise<VideoRoomResponse> {
    const roomId = uuidv4().substring(0, 8).toUpperCase();
    const channelName = appointmentId || `instant-${roomId}`;
    
    let token = '';
    
    if (this.appId && this.appCertificate) {
      token = this.generateAgoraToken(channelName, 0);
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

  private generateAgoraToken(channelName: string, uid: number): string {
    const expireTime = Math.floor(Date.now() / 1000) + 3600;
    const privilegeExpire = expireTime;
    return RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      expireTime,
      privilegeExpire,
    );
  }

  private generateMockToken(channelName: string): string {
    return `demo_token_${channelName}_${Date.now()}`;
  }

  isConfigured(): boolean {
    return !!(this.appId && this.appCertificate);
  }
}