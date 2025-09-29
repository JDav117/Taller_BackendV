import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gestión de Citas Médicas')
    .setDescription('Documentación de la API para gestión de citas médicas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();