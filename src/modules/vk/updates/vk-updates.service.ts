import { Injectable } from '@nestjs/common';
import { CommentContext, LikeContext } from 'vk-io';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class VKUpdatesService {
    constructor(private readonly prisma: PrismaService) {}

    public async findOrCreateGroupUser(groupId: number, userId: number) {
        return this.prisma.groupUser.upsert({
            where: {
                groupId_userId: {
                    groupId,
                    userId,
                },
            },
            create: {
                groupId,
                userId,
            },
            update: undefined,
        });
    }

    public async handleLikeAdd(ctx: LikeContext) {
        const user = await this.findOrCreateGroupUser(
            ctx.$groupId,
            ctx.likerId,
        );

        if (user.likes.includes(ctx.objectId)) {
            return;
        }

        await this.prisma.groupUser.update({
            where: {
                id: user.id,
            },
            data: {
                likes: {
                    push: ctx.objectId,
                },
                score: {
                    increment: 1,
                },
            },
        });
    }

    public async handleLikeRemove(ctx: LikeContext) {
        const user = await this.findOrCreateGroupUser(
            ctx.$groupId,
            ctx.likerId,
        );

        if (!user.likes.includes(ctx.objectId)) {
            return;
        }

        await this.prisma.groupUser.update({
            where: {
                id: user.id,
            },
            data: {
                likes: user.likes.filter((like) => like !== ctx.objectId),
                score: {
                    decrement: 1,
                },
            },
        });
    }

    public async handleBoardCommentAdd(ctx: CommentContext) {
        const user = await this.findOrCreateGroupUser(ctx.$groupId, ctx.fromId);

        if (user.comments.includes(ctx.objectId)) {
            return;
        }

        await this.prisma.groupUser.update({
            where: {
                id: user.id,
            },
            data: {
                comments: {
                    push: ctx.objectId,
                },
                score: {
                    increment: 2,
                },
            },
        });
    }

    public async handleBoardCommentRemove(ctx: CommentContext) {
        const user = await this.findOrCreateGroupUser(ctx.$groupId, ctx.fromId);

        if (!user.comments.includes(ctx.objectId)) {
            return;
        }

        await this.prisma.groupUser.update({
            where: {
                id: user.id,
            },
            data: {
                comments: user.comments.filter(
                    (comment) => comment !== ctx.objectId,
                ),
                score: {
                    decrement: 2,
                },
            },
        });
    }
}
