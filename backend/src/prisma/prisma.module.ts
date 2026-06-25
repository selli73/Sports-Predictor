import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppModule } from '../app.module';


@Module({
  providers: [PrismaService]
})
export class PrismaModule {}
