import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-satus.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, Logger } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { json } from 'body-parser';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController:');
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.userName}" retreiving all tasks. filters ${JSON.stringify(filterDto)}`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.userName}" getting task. Task id ${JSON.stringify(id)}`);
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() creatTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.userName}" creating new task. Task ${JSON.stringify(creatTaskDto)}`);
    return this.tasksService.createTask(creatTaskDto, user);
  }

  @Delete('/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User "${user.userName}" deleting task. Task ${JSON.stringify(id)}`);
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`User "${user.userName}" updating task. Task ${JSON.stringify(id)}`);
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
