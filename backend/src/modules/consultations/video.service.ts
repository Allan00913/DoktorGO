import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

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
    const channelName = `consultation-${appointmentId}`;

    let token = '';
    
    if (this.appId && this.appCertificate) {
      token = this.generateToken(channelName, roomId);
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

  private generateToken(channelName: string, uid: string): string {
    return `mock_token_${channelName}_${uid}_${Date.now()}`;
  }

  private generateMockToken(channelName: string): string {
    return `demo_token_${channelName}_${Date.now()}`;
  }

  isConfigured(): boolean {
    return !!(this.appId && this.appCertificate);
  }
}