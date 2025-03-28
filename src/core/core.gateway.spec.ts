import { Test, TestingModule } from '@nestjs/testing';
import { CoreGateway } from './core.gateway';
import { CoreService } from './core.service';

describe('CoreGateway', () => {
  let gateway: CoreGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreGateway, CoreService],
    }).compile();

    gateway = module.get<CoreGateway>(CoreGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
