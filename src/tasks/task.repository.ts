import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-satus.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.andWhere('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('task.title like :search or task.description like :search',
                { search: `%${search}%` });
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (err) {
            this.logger.error(`Failed to get all tasks for user "${user.userName},
            DTO ${JSON.stringify(filterDto)}`, err.stack);

            throw new InternalServerErrorException();
        }
    }
    async createTask(creatTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = creatTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        try {
            await task.save();
        } catch (err) {
            this.logger.error(`Failed to create task for user "${user.userName}`, err.stack);
            throw new InternalServerErrorException();
        }
        delete task.user;
        return task;
    }
}
