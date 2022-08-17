import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserRoleInTeam } from './interfaces/team.interface';
import { TeamService } from '../teams/services/team.service';
import { DeleteResult } from 'typeorm';
import { ReqCreateTeamDTO } from './dtos/requests/create-team.dto'
import { UserFromToken } from 'src/auth/decorators/dataFromToken.decorator';
import { UserDataFromToken } from 'src/users/interfaces/user.interface';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResCreateTeamDTO } from './dtos/responses/create-team.dto';
import { ResGetTeamDTO } from './dtos/responses/get-team.dto';
import { ResGetTeamUsersDTO } from './dtos/responses/get-team-users.dto';
import { ReqAddUserToTeamDTO } from './dtos/requests/add-user-to-team.dto';
import { ResAddUserToTeamDTO } from './dtos/responses/add-user-to-team.dto';
import { ResDeleteUsersDTO } from 'src/users/dtos/responses/delete-user.dto';
import { ResRenameTeamDTO } from './dtos/responses/rename-team.dto';
import { ResDeleteTeamDTO } from './dtos/responses/delete-team.dto';
import { ReqCreateTaskDTO } from '../tasks/dtos/requests/create-task.dto';
import { ResCreateTaskDTO } from '../tasks/dtos/responses/create-task.dto';
import { ResGetTasksDTO } from '../tasks/dtos/responses/get-tasks.dto';
import { ReqUpdateTaskDTO } from '../tasks/dtos/requests/update-task.dto';
import { ResUpdateTaskDTO } from 'src/tasks/dtos/responses/update-task.dtol';
import { Ids } from './interfaces/team-task.interface';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('teams')
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
    ) {}
    
    @ApiBody({ type: ReqCreateTeamDTO })
    @ApiResponse({ status: 201, description: 'Create team', type: ResCreateTeamDTO})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post()
    createTeam(@UserFromToken() user: UserDataFromToken, @Body() teamName: ReqCreateTeamDTO) { 
        return this.teamService.create(user, teamName.name);
    }

    @ApiResponse({ status: 200, description: 'Get teams', type: [ResGetTeamDTO]})
    @Get()
    getTeams(@UserFromToken() user: UserDataFromToken)/*: Promise<Team[]>*/ {
        return this.teamService.getTeams(user.id);
    }

    @ApiResponse({ status: 200, description: 'Get team users', type: [ResGetTeamUsersDTO]})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Get('/:id/users')
    getTeamById(@UserFromToken() user: UserDataFromToken, @Param('id') id: number) {   
        return this.teamService.getUsers(id, user.id);
    }

    @ApiBody({type: ReqAddUserToTeamDTO})
    @ApiResponse({ status: 201, description: 'Add user to team', type: ResAddUserToTeamDTO})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('/:teamId/users')
    addMemberToTeam(@UserFromToken() user: UserDataFromToken, @Param('teamId') teamId: number, @Body('email') email: string, @Body('role') role: UserRoleInTeam = UserRoleInTeam.USER) {  
        const ids: Ids = {userId: user.id, teamId: teamId};
        return this.teamService.addUserToTeam(ids, email, role);
    }

    @ApiResponse({ status: 200, description: 'Delete user from team', type: ResDeleteUsersDTO})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Delete('/:teamId/users/:userId')
    deleteUserFromTeam(@Param('teamId') teamId: number, @Param('userId') userId: number, @UserFromToken() user: UserDataFromToken) {   
        return this.teamService.deleteUserFromTeam(teamId, userId, user);
    }

    @ApiResponse({ status: 200, description: 'Rename team by id', type: ResRenameTeamDTO})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Patch('/:id')
    renameTeam(@Param('id') teamId: number, @Body() name: ReqCreateTeamDTO, @UserFromToken() user: UserDataFromToken) {   
        return this.teamService.renameTeam(teamId, user.id, name.name);
    }

    @ApiResponse({ status: 200, description: 'Delete team', type: ResDeleteTeamDTO})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Delete('/:id')
    async deleteByName(@UserFromToken() user: UserDataFromToken, @Param('id') id: number): Promise<DeleteResult> {
        return this.teamService.deleteTeamById(user.id, id);
    }

    @ApiBody({type: ReqCreateTaskDTO})
    @ApiResponse({ status: 201, description: 'Create task', type: ResCreateTaskDTO})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('/:id/tasks')
    createTask(@UserFromToken() user: UserDataFromToken, @Param('id') id: number, @Body() task: ReqCreateTaskDTO) {        
        return this.teamService.createTask(user.id, id, task);
    }

    @ApiBody({type: ReqUpdateTaskDTO})
    @ApiResponse({ status: 200, description: 'Update task', type: ResUpdateTaskDTO})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Patch('/:teamId/tasks/:taskId')
    updateTask(@UserFromToken() user: UserDataFromToken, @Param('teamId') teamId: number, @Param('taskId') taskId: number, @Body() body: ReqUpdateTaskDTO) {        
        const ids: Ids = {userId: user.id, teamId, taskId};
        return this.teamService.updateTask(ids, body);
    }

    @ApiResponse({ status: 200, description: 'Get tasks', type: [ResGetTasksDTO]})
    @UsePipes(new ValidationPipe({ transform: true }))
    @Get('/:teamId/tasks')
    getTasks(@UserFromToken() user: UserDataFromToken, @Param('teamId') teamId: number) {
        return this.teamService.getTasks(user.id, teamId);
    }

    @UsePipes(new ValidationPipe({ transform: true }))
    @Delete('/:teamId/tasks/:taskId')
    deleteTask(@UserFromToken() user: UserDataFromToken, @Param('teamId') teamId: number, @Param('taskId') taskId: number) {
        return this.teamService.deleteTask(user.id, teamId, taskId);
    }
}
