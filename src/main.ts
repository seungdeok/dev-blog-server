import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { AppModule } from './app.module';
import { PORT } from './config/config';

const globalPrefix = 'api';
const versionPrefix = 'v';
const defaultVersion = '1';

export const getApp = async () => {
  const app = await NestFactory.create(AppModule);

  // security
  app.use(helmet());
  app.enableCors();
  app.use(cookieParser());
  app.use(csurf({ cookie: true }));

  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: versionPrefix,
    defaultVersion: defaultVersion,
  });

  return app;
};

async function bootstrap() {
  const app = await getApp();

  const config = new DocumentBuilder()
    .setTitle('Dev Blog API')
    .setDescription('Dev Blog 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  Logger.log(
    `🚀 Application is running on: http://localhost:${PORT}/${globalPrefix}/${versionPrefix}${defaultVersion}`,
  );
}

if (process.env.NODE_ENV === 'dev') {
  bootstrap();
}
