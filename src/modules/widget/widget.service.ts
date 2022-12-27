import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { VK } from 'vk-io';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WidgetService {
    constructor(
        private readonly prisma: PrismaService,

        @InjectQueue('widget')
        private readonly widgetQueue: Queue,
    ) {}

    public async createUpdateTask(groupId: number) {
        const existJob = await this.widgetQueue.getJob(groupId);

        const isJobActive = await existJob?.isActive();

        if (!isJobActive) {
            await this.widgetQueue.add('update', groupId, {
                delay: 15 * 1000,
                jobId: groupId,
                removeOnComplete: true,
            });
        }
    }

    public async updateWidgetByGroupId(groupId: number) {
        const group = await this.prisma.group.findUnique({
            where: {
                id: groupId,
            },
        });

        const vk = new VK({
            token: group.token,
            language: 'ru',
        });

        const users = await this.prisma.groupUser.findMany({
            where: {
                groupId,
            },
            orderBy: {
                score: 'desc',
            },
            take: 5,
        });

        const usersInVK = await vk.api.users.get({
            user_ids: users.map((user) => user.userId),
        });

        const _body = users.map((user, index) => {
            const userInVK = usersInVK.find(
                (_userInVK) => _userInVK.id === user.userId,
            );

            return [
                // имя участника
                {
                    text: `${userInVK.first_name} ${userInVK.last_name}`,
                    icon_id: `id${userInVK.id}`,
                    url: `https://vk.com/id${userInVK.id}`,
                },
                // место
                {
                    text: (++index).toString(),
                },
                // лайки
                {
                    text: user.likes.length.toString(),
                },
                // комментарии
                {
                    text: user.comments.length.toString(),
                },
                // баллы
                {
                    text: user.score.toString(),
                },
            ];
        });

        await vk.api.appWidgets.update({
            type: 'table',
            code: `return ${JSON.stringify({
                title: 'Активность в сообществе',
                head: [
                    {
                        text: 'Участники',
                    },
                    {
                        text: 'Место',
                        align: 'center',
                    },
                    {
                        text: '❤️',
                        align: 'center',
                    },
                    {
                        text: '💬',
                        align: 'center',
                    },
                    {
                        text: 'Баллы',
                        align: 'center',
                    },
                ],
                body: _body,
            })};`,
        });
    }
}
