import { Module } from '@nestjs/common';
import { TeamService } from '../teams/services/team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './models/team.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TeamsUsersService } from '../teams/services/team_user.service';
import { TeamsUsersEntity } from './models/team_user.entity';
import { TaskModule } from 'src/tasks/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity, TeamsUsersEntity]),
    AuthModule,
    UsersModule,
    TaskModule,
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamsUsersService],
  exports: [TeamService],
})
export class TeamModule {}
