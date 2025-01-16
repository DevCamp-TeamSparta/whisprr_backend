import { Test, TestingModule } from '@nestjs/testing';
import { InitialService } from './initial.service';

describe('InitialService', () => {
  let service: InitialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitialService],
    }).compile();

    service = module.get<InitialService>(InitialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
