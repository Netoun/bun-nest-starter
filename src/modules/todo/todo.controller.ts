import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import {
  CacheKey,
  CacheTTL,
  CacheInterceptor,
  CACHE_MANAGER,
  type Cache,
} from '@nestjs/cache-manager';
import { TodoService } from './todo.service';
import { todoContract } from './todo.contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

const TODOS_CACHE_KEY = 'todos-list';
const TODO_CACHE_KEY = 'todo';

@Controller('todos')
@UseInterceptors(CacheInterceptor)
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post()
  @TsRestHandler(todoContract.createTodo)
  async create() {
    return tsRestHandler(todoContract.createTodo, async ({ body }) => {
      const todo = await this.todoService.create(body);
      await this.cacheManager.del(TODOS_CACHE_KEY);
      return { status: 201 as const, body: todo };
    });
  }

  @Get()
  @CacheKey(TODOS_CACHE_KEY)
  @CacheTTL(30)
  @TsRestHandler(todoContract.getTodos)
  async findAll() {
    return tsRestHandler(todoContract.getTodos, async ({ query }) => {
      const todos = await this.todoService.findAll({
        offset: query.offset ?? 0,
        limit: query.limit ?? 10,
        userId: query.userId,
      });
      return { status: 200 as const, body: todos };
    });
  }

  @Get(':id')
  @CacheKey(TODO_CACHE_KEY)
  @CacheTTL(60)
  @TsRestHandler(todoContract.getTodo)
  findOne() {
    return tsRestHandler(todoContract.getTodo, async ({ params }) => {
      const todo = await this.todoService.findOne(params.id);
      if (!todo) {
        return { status: 404 as const, body: { message: 'Todo not found' } };
      }
      return { status: 200 as const, body: todo };
    });
  }

  @Patch(':id')
  @TsRestHandler(todoContract.updateTodo)
  async update() {
    return tsRestHandler(todoContract.updateTodo, async ({ params, body }) => {
      const todo = await this.todoService.update(params.id, body);
      if (!todo) {
        return { status: 404 as const, body: { message: 'Todo not found' } };
      }
      await Promise.all([
        this.cacheManager.del(`${TODO_CACHE_KEY}:${params.id}`),
        this.cacheManager.del(TODOS_CACHE_KEY),
      ]);
      return { status: 200 as const, body: todo };
    });
  }

  @Delete(':id')
  @TsRestHandler(todoContract.deleteTodo)
  async remove() {
    return tsRestHandler(todoContract.deleteTodo, async ({ params }) => {
      const todo = await this.todoService.remove(params.id);
      if (!todo) {
        return { status: 404 as const, body: { message: 'Todo not found' } };
      }
      await Promise.all([
        this.cacheManager.del(`${TODO_CACHE_KEY}:${params.id}`),
        this.cacheManager.del(TODOS_CACHE_KEY),
      ]);
      return { status: 200 as const, body: todo };
    });
  }
}
