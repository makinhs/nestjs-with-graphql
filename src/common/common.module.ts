import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [ConfigModule, GraphqlModule, MongoModule, AuthModule],
  exports: [ConfigModule, GraphqlModule, MongoModule, AuthModule],
})
export class CommonModule {}
