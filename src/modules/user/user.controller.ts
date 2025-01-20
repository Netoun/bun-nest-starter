import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import type { Pagination } from 'src/modules/db/db.utils';
import type { NewUser, User } from './user.schema';
import { UserService } from './user.service';
import type { UserWithTodoCount } from './user.service';

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
  async create(@Body() createUserDto: NewUser): Promise<User> {
    const user = await this.userService.create(createUserDto);
    // Invalidate the users list cache
    await this.cacheManager.del(USERS_CACHE_KEY);
    return user;
  }

  @Get()
  @CacheKey(USERS_CACHE_KEY)
  @CacheTTL(30) // 30 seconds
  findAll(@Query() query: Partial<Pagination>): Promise<UserWithTodoCount[]> {
    return this.userService.findAll({
      offset: query.offset ?? 0,
      limit: query.limit ?? 10,
    });
  }

  @Get(':id')
  @CacheKey(USER_CACHE_KEY)
  @CacheTTL(60) // 1 minute
  findOne(@Param('id') id: string): Promise<User | undefined> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<NewUser>
  ): Promise<User | undefined> {
    const user = await this.userService.update(id, updateUserDto);
    // Invalidate both the specific user and the list cache
    await Promise.all([
      this.cacheManager.del(`${USER_CACHE_KEY}:${id}`),
      this.cacheManager.del(USERS_CACHE_KEY),
    ]);
    return user;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User | undefined> {
    const user = await this.userService.remove(id);
    // Invalidate both the specific user and the list cache
    await Promise.all([
      this.cacheManager.del(`${USER_CACHE_KEY}:${id}`),
      this.cacheManager.del(USERS_CACHE_KEY),
    ]);
    return user;
  }
}
