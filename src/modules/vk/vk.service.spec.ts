import { Test, TestingModule } from '@nestjs/testing';
import { VKService } from './vk.service';

describe('VkService', () => {
    let service: VKService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VKService],
        }).compile();

        service = module.get<VKService>(VKService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
