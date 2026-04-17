import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import * as os from 'os';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  async check() {
    let dbStatus = 'unhealthy';
    try {
      await this.dataSource.query('SELECT 1');
      dbStatus = 'healthy';
    } catch (e) {
      dbStatus = 'unhealthy';
    }

    const memUsage = process.memoryUsage();
    const cpuLoad = os.loadavg();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        api: 'ok',
        database: dbStatus,
      },
      system: {
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
        },
        cpu: {
          load: cpuLoad.map(l => l.toFixed(2)),
        },
        platform: os.platform(),
        nodeVersion: process.version,
      },
    };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  async ready() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ready' };
    } catch {
      return { status: 'not ready' };
    }
  }
}