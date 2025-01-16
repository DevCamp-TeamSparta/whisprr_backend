import { Test, TestingModule } from '@nestjs/testing';
import { InitialController } from './initial.controller';

describe('InitialController', () => {
  let controller: InitialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitialController],
    }).compile();

    controller = module.get<InitialController>(InitialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
