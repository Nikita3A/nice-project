import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entities } from 'src/teams/interfaces/entities.interface';
import { Ids } from '../teams/interfaces/team-task.interface';
import { Repository } from 'typeorm';
import { ReqCreateTaskDTO } from './dtos/requests/create-task.dto';
import { TaskEntity } from './models/task.entity';
import { Task } from './interfaces/task.interface';
import { UserRoleInTeam } from 'src/teams/interfaces/team.interface';
import { ReqUpdateTaskDTO } from './dtos/requests/update-task.dto';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(TaskEntity)
        private taskRepository: Repository<TaskEntity>,
    ) {}

    createTask(taskDTO: ReqCreateTaskDTO, entities: Entities) {
        const task: Task = {
            title: taskDTO.title,
            description: taskDTO.description,
            date: !taskDTO.date ? new Date(): taskDTO.date,
            time: taskDTO.time ? taskDTO.time: null, 
            status: taskDTO.status,
            priority: taskDTO.priority,
            created_by: entities.userEntity,
            assigned_to: !entities.assignedTo ? null: entities.assignedTo,
            team: entities.teamEntity,
        };
        return this.taskRepository.save(task);
    }

    async updateTask(role: UserRoleInTeam, ids: Ids, data: ReqUpdateTaskDTO) {
        const task = await this.taskRepository.query(`
        SELECT task_entity.id AS id,
        task_entity.status AS status,
        task_entity.priority AS priority,
        task_entity."assignedToId" AS "assignedToId",
        task_entity."createdById" AS "createdById" 
        FROM task_entity
        INNER JOIN "team_entity" ON task_entity."teamId" = team_entity.id
        INNER JOIN "user_entity" ON task_entity."createdById" = user_entity.id
        WHERE task_entity.id = ${ids.taskId} AND team_entity.id = ${ids.teamId}`);
        
        if (task[0].createdById !== ids.userId || task[0].assignedToId !== ids.userId) {
            if (role !== 'admin' && role !== 'manager') throw new HttpException('Only creator of task and admin with manager can update task', HttpStatus.BAD_REQUEST);
        }
        
        const fields = {
            title: data.title ? data.title : task[0].titke,
            description: data.description ? data.description : task[0].description,
            time: data.time ? data.time : task[0].time,
            status: data.status ? data.status : task[0].status,
            priority: data.priority ? data.priority : task[0].priority,
            assignedTo: data.assignedTo ? data.assignedTo : task[0].assignedToId,    
        }   
        
        return this.taskRepository.update(task[0].id, fields);
    }

    async getTasks(teamId: number) {
        return await this.taskRepository.query(`
        SELECT task_entity.id AS id,
        task_entity.title AS title,
        task_entity.description AS description,
        task_entity.date AS date,                
        task_entity.time AS time,
        task_entity.status AS status,
        task_entity.priority AS priority,
        task_entity."assignedToId" AS "assignedToId",
        task_entity."createdById" AS "createdById" 
        FROM task_entity
        INNER JOIN "team_entity" ON task_entity."teamId" = team_entity.id
        INNER JOIN "user_entity" ON task_entity."createdById" = user_entity.id
        WHERE team_entity.id = ${teamId}`);
    }

    deleteTask(taskId: number, teamId: number) {
        return this.taskRepository.query(`
        DELETE FROM "task_entity"
        USING "team_entity" team
        WHERE task_entity.id = ${taskId} AND team.id = ${teamId};`);
    }
}
