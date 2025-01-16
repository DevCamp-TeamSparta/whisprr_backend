import { Injectable } from '@nestjs/common';
import { TimeLimitEntity } from './entities/time_limit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TimeLimitService {
  constructor(
    @InjectRepository(TimeLimitEntity)
    private timeLimitRepository: Repository<TimeLimitEntity>,
  ) {}

  async getTimeLimit() {
    return await this.timeLimitRepository.find();
  }
}
