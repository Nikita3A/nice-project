import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AvatarsEntity } from "./models/avatars.entity";
import { StorageService } from "./storage.service";
import { StorageController } from './storage.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvatarsEntity]),
  ],
  providers: [StorageService],
  exports: [StorageService],
  controllers: [StorageController],
})
export class StorageModule {}