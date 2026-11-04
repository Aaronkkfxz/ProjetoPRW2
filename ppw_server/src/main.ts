import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //localhost:8000/v1/ticket/1
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, PUT, POST, DELETE, PATCH',
    allowedHeader: 'Content-Type, Accept, Authorization,  X-Requested-With',
    credentials: false,
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
