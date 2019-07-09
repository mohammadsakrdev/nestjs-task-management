import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-satus.enum';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {

  constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) { }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ id, user });
    if (!found) {
      throw new NotFoundException(`Task with Id ${id} is not found`);
    }
    return found;
  }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter(t => t.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(
  //       t => t.description.includes(search) || t.title.includes(search),
  //     );
  //   }
  //   return tasks;
  // }

  async createTask(creatTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(creatTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with Id ${id} is not found`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    return task;
  }
}
