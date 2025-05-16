import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from 'apps/user/src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001,
      // port: parseInt(process.env.TCP_PORT) || 3001,
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.HTTP_PORT ?? 3000);
}
bootstrap();
