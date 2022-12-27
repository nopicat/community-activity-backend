import { Module } from '@nestjs/common';
import { WidgetConsumer } from './widget.consumer';
import { WidgetService } from './widget.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'widget',
            redis: {
                host: 'redis',
                port: 6379,
            },
        }),
    ],
    providers: [WidgetConsumer, WidgetService, PrismaService],
    exports: [WidgetService],
})
export class WidgetModule {}
