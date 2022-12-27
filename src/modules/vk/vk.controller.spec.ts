import { Test, TestingModule } from '@nestjs/testing';
import { VKController } from './vk.controller';

describe('VkController', () => {
    let controller: VKController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VKController],
        }).compile();

        controller = module.get<VKController>(VKController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
