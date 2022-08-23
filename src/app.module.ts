import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './teams/team.module';
import { TaskModule } from './tasks/task.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './utils/logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from './auth/guards/token.guard';
import { StorageModule } from './storage/storage.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('HOST'),
        database: cfg.get('DATABASE'),
        username: cfg.get('USER_DB'),
        password: cfg.get('PASSWORD'),
        // ssl: { rejectUnauthorized: false },
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    TeamModule,
    TaskModule,
    LoggerModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
