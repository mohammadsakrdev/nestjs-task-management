import { TaskStatus } from '../task-satus.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
export class GetTasksFilterDto {
  @IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
  @IsOptional()
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
