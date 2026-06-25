import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private _configService: ConfigService) {
        const dataBaseUrl = _configService.getOrThrow('DATABASE_URL');
        const adapter = new PrismaPg({
            connectionString: dataBaseUrl
        })
        super({
            adapter
        });
    }
}
