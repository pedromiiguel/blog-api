import { Module } from '@nestjs/common';
import { BCryptHashingService } from './hashing/bcrypt-hashing.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BCryptHashingService,
    },
  ],

  exports: [HashingService],
})
export class CommonModule {}
