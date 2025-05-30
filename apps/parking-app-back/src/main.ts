import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/config/swagger.config';
import { CreateInitialUserUseCase } from './modules/users/application/use-cases';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  const port = parseInt(process.env.BACK_PORT ?? '3000', 10);
  await app.listen(port);
  logger.log(`🚀 Application started on http://localhost:${port}`);

  logger.log(
    `📚 Documentation Swagger available on http://localhost:${port}/docs`,
  );

  const seeder = app.get(CreateInitialUserUseCase);
  await seeder.execute();
}
bootstrap();
