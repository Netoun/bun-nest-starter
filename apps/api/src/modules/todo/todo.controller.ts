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
import {contract}  from '@nest-bun-drizzle/shared';
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
  @TsRestHandler(contract.todoContract.createTodo)
  async create() {
    return tsRestHandler(contract.todoContract.createTodo, async ({ body }) => {
      const todo = await this.todoService.create(body);
      await this.cacheManager.del(TODOS_CACHE_KEY);
      return { status: 201 as const, body: todo };
    });
  }

  @Get()
  @CacheKey(TODOS_CACHE_KEY)
  @CacheTTL(30)
  @TsRestHandler(contract.todoContract.getTodos)
  async findAll() {
    return tsRestHandler(contract.todoContract.getTodos, async ({ query }) => {
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
  @TsRestHandler(contract.todoContract.getTodo)
  findOne() {
    return tsRestHandler(contract.todoContract.getTodo, async ({ params }) => {
      const todo = await this.todoService.findOne(params.id);
      if (!todo) {
        return { status: 404 as const, body: { message: 'Todo not found' } };
      }
      return { status: 200 as const, body: todo };
    });
  }

  @Patch(':id')
  @TsRestHandler(contract.todoContract.updateTodo)
  async update() {
    return tsRestHandler(contract.todoContract.updateTodo, async ({ params, body }) => {
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
  @TsRestHandler(contract.todoContract.deleteTodo)
  async remove() {
    return tsRestHandler(contract.todoContract.deleteTodo, async ({ params }) => {
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
