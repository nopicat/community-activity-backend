import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VKModule } from './modules/vk/vk.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { WidgetModule } from './modules/widget/widget.module';
import { CommunityModule } from './modules/community/community.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot(), VKModule, WidgetModule, CommunityModule],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}
