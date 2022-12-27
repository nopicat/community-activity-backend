import { IsNumber, IsString } from 'class-validator';

export class VKAddCommunityInput {
    @IsNumber()
    public groupId: number;

    @IsString()
    public token: string;
}
