import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HttpService } from '@nestjs/axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpService = app.get(HttpService);
  app.enableCors();
  app.useGlobalInterceptors(new TokenInterceptor(httpService));
  await app.listen(3000);
}
bootstrap();
