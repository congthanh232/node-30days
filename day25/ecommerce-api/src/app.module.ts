import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './common/modules/health/health.module';
import { UserModule } from './common/modules/user/user.module';
import { AuthModule } from './common/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
