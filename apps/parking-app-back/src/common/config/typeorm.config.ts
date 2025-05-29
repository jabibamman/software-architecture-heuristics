import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  database: process.env.DB_NAME ?? 'postgres',
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  entities: [join(__dirname, '/../modules/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/../migrations/*{.ts,.js}')],
  synchronize: true,
  migrationsRun: false,
  logging: false,
  autoLoadEntities: true,
};
