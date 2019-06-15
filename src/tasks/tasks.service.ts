import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  // Get all tasks
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // Get filtered tasks
  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    // Cloning tasks
    let tasks = [...this.tasks];
    // Filtering by status
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    // Filtering by search
    if (search) {
      // Will return tasks where search term appears either in title or description
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  // Get task by id
  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  // Create new tasks
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid.v4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  // Update task status
  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  // Delete a task
  deleteTask(id: string): Task {
    // Find the task to be deleted
    const task = this.tasks.find(task => task.id === id);
    // Find the index of the task to be deleted
    const index = this.tasks.indexOf(task);
    // Remove it from the array
    this.tasks.splice(index, 1);
    return task;
  }
}
