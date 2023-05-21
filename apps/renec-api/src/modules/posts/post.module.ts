import { Module } from '@joktec/core';
import { PostController } from './post.controller';
import { PostRepo } from './post.repo';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostRepo, PostService],
  exports: [PostService],
})
export class PostModule {}
