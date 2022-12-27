import { Body, Controller, Post } from '@nestjs/common';
import { VKAddCommunityInput } from '../vk/vk.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommunityService } from './community.service';
import { ConfigService } from '@nestjs/config';
import { VK } from 'vk-io';

@Controller('community')
export class CommunityController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly communityService: CommunityService,

        private readonly configService: ConfigService,
    ) {}

    @Post('add')
    public async addCommunity(@Body() body: VKAddCommunityInput) {
        const vk = new VK({
            token: body.token,
            language: 'ru',
        });

        const generatedSecretKey =
            await this.communityService.generateSecretKey();

        const appDomain = this.configService.get<string>('APP_DOMAIN');

        const newCallbackServer = await vk.api.groups.addCallbackServer({
            group_id: body.groupId,
            secret_key: generatedSecretKey,
            url: `https://${appDomain}/vk/updates/callback/${body.groupId}`,
            title: 'Активность',
        });

        await vk.api.groups.setCallbackSettings({
            group_id: body.groupId,
            server_id: newCallbackServer.server_id,
            like_add: true,
            like_remove: true,
            wall_reply_new: true,
            wall_reply_restore: true,
            wall_reply_delete: true,
        });

        await this.prisma.group.create({
            data: {
                id: body.groupId,
                token: body.token,
                callbackId: newCallbackServer.server_id,
                secret: generatedSecretKey,
            },
        });

        return;
    }
}
