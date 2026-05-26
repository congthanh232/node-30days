import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix — tất cả route đều bắt đầu bằng /api/v1
  app.setGlobalPrefix('api/v1');

  // Global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 🔑 Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for E-commerce system')
    .setVersion('1.0')
    .addBearerAuth() // thêm auth scheme JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // UI tại /api/docs

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(` Server running on http://localhost:${port}/api/v1`);
  console.log(` Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
