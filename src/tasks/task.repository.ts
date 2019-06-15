import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  // Get tasks
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    let { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    // If status query provided
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    // If search query provided
    if (search) {
      // Handling both lowercase and uppercase query
      search = search.toUpperCase();
      query.andWhere(
        '(UPPER(task.title) LIKE :search OR UPPER(task.description) LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  // Get task by id
  async getTaskById(id: number): Promise<Task> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  // Create task
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }

  // Update task
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  // Delete task
  async deleteTask(id: number): Promise<void> {
    const result = await this.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
