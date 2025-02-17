import { Test, TestingModule } from '@nestjs/testing';
import { ParsesService } from './parses.service';

describe('ParsesService', () => {
  let service: ParsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParsesService],
    }).compile();

    service = module.get<ParsesService>(ParsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
