import {
    Body,
    Controller,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { VKUpdatesService } from './vk-updates.service';
import { WidgetService } from '../../widget/widget.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { VK } from 'vk-io';

@Controller('vk/updates')
export class VKUpdatesController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly vkUpdatesService: VKUpdatesService,
        private readonly widgetService: WidgetService,
    ) {}

    @Post('callback/:groupId')
    @HttpCode(200)
    public async callback(
        @Param('groupId', ParseIntPipe) groupId: number,
        @Body() body: Record<string, unknown>,
    ) {
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        const vk = new VK({ token: group.token });

        if (body?.type === 'confirmation') {
            const code = await vk.api.groups.getCallbackConfirmationCode({
                group_id: groupId,
            });

            return code.code;
        }

        if (body?.secret !== group.secret) {
            return 'not ok';
        }

        vk.updates.on('like_add', (ctx) =>
            this.vkUpdatesService.handleLikeAdd(ctx),
        );
        vk.updates.on('like_remove', (ctx) =>
            this.vkUpdatesService.handleLikeRemove(ctx),
        );

        vk.updates.on(['board_comment_new', 'board_comment_restore'], (ctx) =>
            this.vkUpdatesService.handleBoardCommentAdd(ctx),
        );
        vk.updates.on('board_comment_delete', (ctx) =>
            this.vkUpdatesService.handleBoardCommentRemove(ctx),
        );

        await vk.updates.handleWebhookUpdate(body);

        await this.widgetService.createUpdateTask(groupId);

        return 'ok';
    }
}
