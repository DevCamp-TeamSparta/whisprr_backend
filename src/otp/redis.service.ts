import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });

    this.redis.on('connect', () => console.log('Redis Connected!'));
    this.redis.on('error', (err) => console.error('Redis Error:', err));
  }

  getClient(): Redis {
    return this.redis;
  }

  onModuleInit() {
    console.log('RedisService Initialized');
  }

  async onModuleDestroy() {
    console.log('Closing Redis Connection...');
    await this.redis.quit();
  }
}
