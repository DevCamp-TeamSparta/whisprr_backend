import { Test, TestingModule } from '@nestjs/testing';
import { TimeLimitService } from './time_limit.service';

describe('TimeLimitService', () => {
  let service: TimeLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeLimitService],
    }).compile();

    service = module.get<TimeLimitService>(TimeLimitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
