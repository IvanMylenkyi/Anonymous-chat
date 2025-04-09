import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

// Необходимо для работы с xml
import * as xmlparser from 'express-xml-bodyparser';
import * as hbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.engine(
    "hbs",
    hbs.engine(
      {
        extname: "hbs",
        helpers: {
          url: (host, url) => `http://${host.replace(/\/$/, '')}${url.startsWith('/') ? url : '/' + url}`
        }
      }
    )
  );
  app.setViewEngine("hbs")
  app.setBaseViewsDir(join(__dirname, "..", "templates"));
  app.useStaticAssets(join(__dirname, "..", "static"));
  app.use(cookieParser());

  app.enableCors({
    allowedHeaders: ['X-Requested-With', 'Content-Type'],
  });

  app.use(xmlparser());

  app.use((req, res, next) => {
    res.locals.host = req.get('host'); // Доступно во всех шаблонах
    next();
  });
  
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
