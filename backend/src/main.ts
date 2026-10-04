import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.enableCors({
    origin: ['http://localhost', 'http://localhost:5173']
  })
  const config = new DocumentBuilder()
    .setTitle('Sports predictor')
    .setDescription('API document for the predictor')
    .setVersion('1.0')
    .addGlobalResponse({ status: 500, description: 'Internal server error' })
    .addGlobalResponse({ status: 400, description: 'Bad request' })
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
