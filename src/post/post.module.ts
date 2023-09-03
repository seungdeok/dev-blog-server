import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TagService } from 'src/tag/tag.service';
import { Tag } from 'src/tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag])],
  controllers: [PostController],
  providers: [PostService, TagService],
  exports: [],
})
export class PostModule {}
