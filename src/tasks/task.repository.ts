import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-satus.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('task.title like :search or task.description like :search', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }
    async createTask(creatTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = creatTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task;
    }
}
