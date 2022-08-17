import { Priority, Status } from "src/tasks/interfaces/task.interface";

export interface Ids {
    teamId?: number;
    taskId?: number;
    userId?: number;
}

export interface IdsParams {
    userId: number;
    teamId: number;
}

export interface TaskUpdateBody {
    assignedTo?: string;
    status?: Status;
    priority?: Priority;
}

export interface TaskUpdate {
    assignedTo?: number;
    status?: Status;
    priority?: Priority;
}