import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  //config cors
  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  });

  //config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,

    defaultVersion: ['1', '2']
  });

  await app.listen(configService.get<string>('PORT') ?? 3000);
}
void bootstrap();
