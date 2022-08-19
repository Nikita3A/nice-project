import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { TeamEntity } from '../models/team.entity';
import { UserRoleInTeam } from '../interfaces/team.interface';
import { UserDataFromToken } from 'src/users/interfaces/user.interface';
import { UserEntity } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/users.service';
import { TeamsUsersService } from '../services/team_user.service';
import { TaskService } from 'src/tasks/task.service';
import { Ids } from '../interfaces/team-task.interface';
import { ReqCreateTaskDTO } from '../../tasks/dtos/requests/create-task.dto';
import { Entities } from '../interfaces/entities.interface';
import { ReqUpdateTaskDTO } from 'src/tasks/dtos/requests/update-task.dto';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(TeamEntity)
        private teamRepository: Repository<TeamEntity>,
        private readonly memberService: TeamsUsersService,
        private readonly usersService: UsersService,
        private readonly taskService: TaskService,
    ) {}

    async create(user: UserDataFromToken, teamName: string) {
        const userEntity = Object.assign(new UserEntity(), user);
        
        const team = new TeamEntity();
        team.name = teamName;
        team.createdBy = userEntity;

        const createdTeam = await this.teamRepository.save(team);
        
        await this.memberService.addUserToTeam(team, userEntity, UserRoleInTeam.ADMIN);        
        
        return createdTeam;
    }

    getUsers(teamId: number, userId: number)  {
        return this.memberService.getUsers(teamId, userId);
    }

    async addUserToTeam (ids: Ids, email: string, role: UserRoleInTeam) {
        const team = await this.teamRepository.findOne(ids.teamId);        
        const user = await this.usersService.findOne(email);
        if (!user) throw new HttpException('You can not add the user with such an email because the user does not exist', HttpStatus.BAD_REQUEST);
        
        const member = await this.isMemberOfTeam(team.id, ids.userId);

        if (member.role !== 'admin' && member.role !== 'manager') throw new HttpException('Only admin and manager can add another users', HttpStatus.BAD_REQUEST);

        return await this.memberService.addUserToTeam(team, user, role)
    }

    async deleteUserFromTeam(teamId: number, userId: number, user: UserDataFromToken) {        
        return await this.memberService.deleteUserFromTeam(teamId, userId, user);
    }

    async renameTeam(teamId: number, userId: number, name: string) {
        const userInTeam = await this.memberService.findUser(teamId, userId);
        if (userInTeam.role !== 'admin') throw new HttpException('Team can be renamed only by admin', HttpStatus.BAD_REQUEST);

        return this.teamRepository.update(teamId, {name: name});
    }

    async getTeams(id: number)/*: Promise<Team[]>*/ {        
        return this.memberService.getTeams(id);
    }

    async deleteTeamById(userId: number, teamId: number) {
        const deletedTeam = await this.teamRepository.query(`
        DELETE FROM "team_entity"
        WHERE id = ${teamId} AND "createdById" = ${userId};`);

        const affectedRow = 0;
        
        if (deletedTeam[1] == affectedRow) throw new HttpException('You can not delete the team because you did not create it', HttpStatus.BAD_REQUEST);
        
        return deletedTeam;
    }

    async createTask(userId: number, teamId: number, taskDTO: ReqCreateTaskDTO) {
        const member = await this.isMemberOfTeam(teamId, userId);
        let assignedTo;

        const user = await this.usersService.findOne(taskDTO.assignedTo);
        assignedTo = await this.memberService.findUser(teamId, user?.id);

        if (assignedTo == undefined) assignedTo = member.user;
        if (assignedTo == undefined && taskDTO.assignedTo) throw new HttpException('Assignee is not member of the team', HttpStatus.BAD_REQUEST);

        const userEntity: UserEntity = Object.assign(new UserEntity(), member.user);
        const teamEntity = await this.teamRepository.findOne(teamId);
        
        const entities: Entities = { 
            assignedTo: assignedTo.user,
            teamEntity: teamEntity,
            userEntity: userEntity,
        }
        
        return await this.taskService.createTask(taskDTO, entities);
    }

    async updateTask(ids: Ids, body: ReqUpdateTaskDTO) {
        const member = await this.isMemberOfTeam(ids.teamId, ids.userId);

        let assignee;

        if (body.assignedTo) {
            const userToassign = await this.usersService.findOne(body.assignedTo);
            assignee = await this.memberService.findUser(ids.teamId, userToassign?.id);
            if (!assignee) throw new HttpException('Assignee is not member of the team', HttpStatus.BAD_REQUEST);
        }
        body.assignedTo = assignee?.user.id;        

        return this.taskService.updateTask(member.role, ids, body);
    }

    async getTasks(userId: number, teamId: number) {
        await this.isMemberOfTeam(teamId, userId);
        return this.taskService.getTasks(teamId);
    }

    async deleteTask(userId: number, teamId: number, taskId: number) {
        await this.isMemberOfTeam(teamId, userId);
        return this.taskService.deleteTask(taskId, teamId);
    }

    async isMemberOfTeam(teamId: number, userId: number) {
        const member = await this.memberService.findUser(teamId, userId);
        if (!member) throw new HttpException('You are not member of the team', HttpStatus.BAD_REQUEST);
        return member
    }
}