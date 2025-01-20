import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { NewTodo, Todo } from './todo.schema';
import { TodoService } from './todo.service';

@Controller('users/:userId/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createTodoDto: Omit<NewTodo, 'userId'>
  ): Promise<Todo> {
    return this.todoService.create({ ...createTodoDto, userId });
  }

  @Get()
  findAll(@Param('userId', ParseUUIDPipe) userId: string): Promise<Todo[]> {
    return this.todoService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Todo | undefined> {
    return this.todoService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: Partial<Omit<NewTodo, 'userId'>>
  ): Promise<Todo | undefined> {
    return this.todoService.update(id, userId, updateTodoDto);
  }

  @Delete(':id')
  remove(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Todo | undefined> {
    return this.todoService.remove(id, userId);
  }

  @Patch(':id/toggle')
  toggleComplete(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Todo | undefined> {
    return this.todoService.toggleComplete(id, userId);
  }
}
