import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 7001);
}
bootstrap();
