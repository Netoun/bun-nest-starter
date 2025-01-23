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
import { UserService } from './user.service';
import contract from '@nest-bun-drizzle/contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

const USERS_CACHE_KEY = 'users-list';
const USER_CACHE_KEY = 'user';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UserController { 
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post()
  @TsRestHandler(contract.user.createUser)
  async create() {
    return tsRestHandler(contract.user.createUser, async ({ body }) => {
      const user = await this.userService.create(body);
      await this.cacheManager.del(USERS_CACHE_KEY);
      return { status: 201, body: user };
    });
  }

  @Get()
  @CacheKey(USERS_CACHE_KEY)
  @CacheTTL(30)
  @TsRestHandler(contract.user.getUsers)
  async findAll() {
    return tsRestHandler(contract.user.getUsers, async ({ query }) => {
      const users = await this.userService.findAll({
        offset: query.offset ?? 0,
        limit: query.limit ?? 10,
      });
      return { status: 200, body: users };
    });
  }

  @Get(':id')
  @CacheKey(USER_CACHE_KEY)
  @CacheTTL(60)
  @TsRestHandler(contract.user.getUser)
  findOne() {
    return tsRestHandler(contract.user.getUser, async ({ params }) => {
      const user = await this.userService.findOne(params.id);
      if (!user) {
        return { status: 404, body: { message: 'User not found' } };
      }
      return { status: 200, body: user };
    });
  }

  @Patch(':id')
  @TsRestHandler(contract.user.updateUser)
  async update() {
    return tsRestHandler(contract.user.updateUser, async ({ params, body }) => {
      const user = await this.userService.update(params.id, body);
      if (!user) {
        return { status: 404, body: { message: 'User not found' } };
      }
      await Promise.all([
        this.cacheManager.del(`${USER_CACHE_KEY}:${params.id}`),
        this.cacheManager.del(USERS_CACHE_KEY),
      ]);
      return { status: 200, body: user };
    });
  }

  @Delete(':id')
  @TsRestHandler(contract.user.deleteUser)
  async remove() {
    return tsRestHandler(contract.user.deleteUser, async ({ params }) => {
      const user = await this.userService.remove(params.id);
      if (!user) {
        return { status: 404, body: { message: 'User not found' } };
      }
      await Promise.all([
        this.cacheManager.del(`${USER_CACHE_KEY}:${params.id}`),
        this.cacheManager.del(USERS_CACHE_KEY),
      ]);
      return { status: 200, body: user };
    });
  }
}

