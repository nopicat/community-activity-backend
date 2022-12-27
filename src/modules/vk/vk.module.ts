import { Module } from '@nestjs/common';
import { VKService } from './vk.service';
import { VKController } from './vk.controller';
import { VKUpdatesService } from './updates/vk-updates.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { VKUpdatesController } from './updates/vk-updates.controller';
import { WidgetModule } from '../widget/widget.module';

@Module({
    imports: [WidgetModule],
    providers: [VKService, VKUpdatesService, PrismaService],
    controllers: [VKController, VKUpdatesController],
})
export class VKModule {}
