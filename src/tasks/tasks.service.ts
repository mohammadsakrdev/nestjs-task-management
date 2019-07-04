import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-satus.enum';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {

  constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) { }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
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

  async createTask(creatTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(creatTaskDto);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with Id ${id} is not found`);
    }
  }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
