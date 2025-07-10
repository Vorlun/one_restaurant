import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function start() {
  try {
    const PORT = process.env.PORT ?? 3030;
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      credentials: true,
    }); 

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    app.use(cookieParser());

    const config = new DocumentBuilder()
      .setTitle('One Restaurant Project')
      .setDescription('OneRestaurant RESTFULL API')
      .setVersion('1.0')
      .addTag('AccessToken, RefreshToken, Cookie, BOT, SMS, SendMail, Guards')
      .addBearerAuth()
      .build();

    const document =SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(PORT, () => {
      console.log(`✅ Server started at: http://localhost:${PORT}/api`);
      console.log(`✅ Swagger Docs: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
