import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import {
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  // Get tasks
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    let { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    // Pulling out tasks owned by authenticated user
    query.where('task.userId = :userId', { userId: user.id });

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

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  // Get task by id
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.findOne({ where: { id, userId: user.id } });
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  // Create task
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.user = user;
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    try {
      await task.save();
      delete task.user;
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${
          user.username
        }". Data: ${JSON.stringify(createTaskDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  // Update task
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  // Delete task
  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.delete({ id, userId: user.id });

    if (!result.affected) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
