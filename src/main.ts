import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PinoLoggerService } from './logger/pino-logger.service';
import { LoggingInterceptor } from './logger/logging.interceptor';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;  
  
  // app.setGlobalPrefix('api');
  Sentry.init({
    environment: configService.get('SENTRY_ENVIRONMENT_DEVELOPMENT'),
    dsn: 'https://7fbbf24340894dad941e68099372be32@o1278899.ingest.sentry.io/6478950',
  });

  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Coursework')
  .setDescription('The coursework API description')
  .setVersion('0.0.1')
  .addTag('coursework')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useLogger(app.get(PinoLoggerService));
  
  await app.listen(port, () => {console.log(`Server is running on: http://localhost:${port}/api/`)});
}
bootstrap();
