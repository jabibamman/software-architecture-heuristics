import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: join(__dirname, '..', '..', '..', '..', '.env'),
});
