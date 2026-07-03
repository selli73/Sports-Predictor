import { Module } from '@nestjs/common';
import { FootballService } from './football.service';
import { FootballController } from './football.controller';
import { HttpModule } from '@nestjs/axios';



@Module({
  imports: [HttpModule.register({
    timeout: 20000,
    maxContentLength: 10 * 1024 * 1024,
    maxRedirects: 5
  })],
  controllers: [FootballController],
  providers: [FootballService],
})
export class FootballModule {}
