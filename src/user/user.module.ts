import { Module } from '@nestjs/common';
import { EncryptionModule } from '../encryption/encryption.module';
import { UserService } from './user.service';

@Module({
  imports:[EncryptionModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
