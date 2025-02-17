import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParseAfterInterviewEntity } from './entities/parses.entity';

@Injectable()
export class ParsesService {
  constructor(
    @InjectRepository(ParseAfterInterviewEntity)
    private parseAfterInterviewRepository: Repository<ParseAfterInterviewEntity>,
  ) {}

  public async getParses(): Promise<ParseAfterInterviewEntity[]> {
    const parses = await this.parseAfterInterviewRepository.find();

    return parses;
  }
}
