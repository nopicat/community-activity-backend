import { Process, Processor } from '@nestjs/bull';
import { WidgetService } from './widget.service';
import { Job } from 'bull';

@Processor('widget')
export class WidgetConsumer {
    constructor(private readonly widgetService: WidgetService) {}

    @Process('update')
    public async update(job: Job<number>) {
        await this.widgetService.updateWidgetByGroupId(job.data);
    }
}
