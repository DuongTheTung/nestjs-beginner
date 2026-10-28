import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // đọc metadate từ custom decorate (@Public,@Roles)
  const reflector = app.get(Reflector);
  // áp dụng jwtguard global
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // áp dụng validate tự động DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // áp dụng transform interceptor chuẩn hóa dữ liệu trả về
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.use(cookieParser('my-secret'));
  //cấu hình cors
  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    credentials: true,
  });

  //config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,

    defaultVersion: ['1', '2']
  });

  // swagger
  const config = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  //Lấy cổng PORT từ .env thông qua configService.
  await app.listen(configService.get<string>('PORT') ?? 3000);
}
void bootstrap();
