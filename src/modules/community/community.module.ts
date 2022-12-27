import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [CommunityService, PrismaService, ConfigService],
    controllers: [CommunityController],
})
export class CommunityModule {}
