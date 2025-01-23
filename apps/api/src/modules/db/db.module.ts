import { Global, Module } from '@nestjs/common';
import { db } from '@/modules/db/db.config';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE',
      useValue: db,
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
