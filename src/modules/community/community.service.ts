import { Injectable } from '@nestjs/common';
import { promisify } from 'node:util';
import * as crypto from 'node:crypto';

@Injectable()
export class CommunityService {
    public async generateSecretKey() {
        const randomBytes = promisify(crypto.randomBytes);
        const secretKey = await randomBytes(20);

        return secretKey.toString('hex');
    }
}
