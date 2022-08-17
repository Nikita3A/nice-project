import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { TeamEntity } from '../models/team.entity';
import { TeamsUsers, UserRoleInTeam } from '../interfaces/team.interface';
import { User, UserDataFromToken } from 'src/users/interfaces/user.interface';
import { TeamsUsersEntity } from '../models/team_user.entity';

@Injectable()
export class TeamsUsersService {
    constructor(
        @InjectRepository(TeamsUsersEntity)
        private teamsUsersRepository: Repository<TeamsUsersEntity>,
    ) {}
    
    async getTeams (id: number) {
        const data = await this.teamsUsersRepository.query(`
        WITH v1 as (SELECT team_entity.id AS id FROM "teams_users_entity" 
        INNER JOIN "team_entity" ON "teamId" = team_entity.id
        INNER JOIN "user_entity" ON "userId" = user_entity.id
        WHERE "userId" = ${id})
        SELECT team_entity.id AS id, team_entity.name AS name, "createdById" AS createdById,
        COUNT(*) AS "numberOfMembers"
        FROM "teams_users_entity"
        INNER JOIN "team_entity" ON "teamId" = team_entity.id 
        INNER JOIN "user_entity" ON "userId" = user_entity.id
        WHERE "teamId" IN (SELECT id FROM v1) GROUP BY team_entity.id;`);

        return data;
    }

    async getUsers (teamId: number, userId: number) {
        const user = await this.findUser(teamId, userId);        
        if (!user) throw new HttpException('You are not member of the team', HttpStatus.BAD_REQUEST);

        const data = await this.teamsUsersRepository.query(`
        SELECT user_entity.id AS id, user_entity.name AS name, user_entity.email AS email, teams_users_entity.role AS role    
        FROM "teams_users_entity" INNER JOIN "team_entity" ON "teamId" = team_entity.id
        INNER JOIN "user_entity" ON "userId" = user_entity.id
        WHERE team_entity.id = ${teamId};`);

        return data;
    }

    async addUserToTeam(team: TeamEntity, user: User, role: UserRoleInTeam) {                
        const member = await this.findUser(team.id, user.id); 
        if (member) throw new HttpException('This user is already member of the team', HttpStatus.BAD_REQUEST);

        const teamsUsers: TeamsUsers = {
            team: team,
            user: user,
            role: role
        }
        
        return await this.teamsUsersRepository.save(teamsUsers);
    }

    findTeamById(id: number) {
        return this.teamsUsersRepository.createQueryBuilder("teams_users_entity")
        .innerJoinAndSelect("teams_users_entity.team", "team_entity")
        .innerJoinAndSelect("teams_users_entity.user", "user_entity")
        .where("team_entity.id = :id", { id })
        .getOne()
    }

    async findUser(teamId: number, userId: number) {
        return await this.teamsUsersRepository.createQueryBuilder("teams_users_entity")
        .innerJoinAndSelect("teams_users_entity.team", "team_entity")
        .innerJoinAndSelect("teams_users_entity.user", "user_entity")
        .where("team_entity.id = :teamId and user_entity.id = :userId", { teamId, userId })
        .getOne()
    }

    async deleteUserFromTeam(teamId: number, userId: number, user: UserDataFromToken) {
        const userWhoDelete = await this.findUser(teamId, user.id);
        if (userWhoDelete == undefined) throw new HttpException('You are not member of the team', HttpStatus.BAD_REQUEST);
        
        if (userWhoDelete.role !== 'admin' && userWhoDelete.role !== 'manager') throw new HttpException('You do not have right to delete', HttpStatus.BAD_REQUEST);

        const userOfTeamToDelete = await this.findUser(teamId, userId);

        if (userOfTeamToDelete.role == 'admin') throw new HttpException('Admin can not be deleted', HttpStatus.BAD_REQUEST);
        if (userWhoDelete.role !== 'admin' && userOfTeamToDelete.role == 'manager') throw new HttpException('Manager can be deleted only by admin', HttpStatus.BAD_REQUEST);
        
        return this.teamsUsersRepository.delete(userOfTeamToDelete.id);
    }
}

