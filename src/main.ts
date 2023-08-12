import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PORT } from './config';

const globalPrefix = 'api';
const versionPrefix = 'v';
const defaultVersion = '1';

export const getApp = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

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
  await app.listen(PORT);
  Logger.log(
    `🚀 Application is running on: http://localhost:${PORT}/${globalPrefix}/${versionPrefix}${defaultVersion}`,
  );
}

if (process.env.NODE_ENV === 'dev') {
  bootstrap();
}
