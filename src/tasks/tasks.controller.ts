import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from 'dist/tasks/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

// Will handle request sent to /tasks
@Controller('/tasks')
export class TasksController {
  // Injects tasks Service
  constructor(private tasksService: TasksService) {}

  // Will handle GET request to /tasks
  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  // Will handle GET request to /tasks/:id
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  // Will handle POST request to /tasks/:id
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  // Will handle PATCH request to /tasks/:id/status
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }

  // Delete a task
  @Delete('/:id')
  deleteTask(@Param('id') id: string): Task {
    return this.tasksService.deleteTask(id);
  }
}
