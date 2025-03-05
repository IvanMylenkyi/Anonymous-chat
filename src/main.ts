import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setViewEngine("hbs");
  app.setBaseViewsDir(join(__dirname, "..", "templates"));
  app.useStaticAssets(join(__dirname, "..", "static"));
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 7001);
}
bootstrap();
