import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  private posts: Array<Post> = [];
  private id = 0;

  create(createPostDto: CreatePostDto) {
    const createdAt = new Date();
    this.posts.push({
      id: ++this.id,
      ...createPostDto,
      created_at: createdAt,
      modified_at: createdAt,
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  findOne(id: number) {
    const found = this.posts.find((u) => u.id === id);
    if (!found) throw new NotFoundException();
    return found;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const found = this.findOne(id);
    this.remove(id);
    this.posts.push({ ...found, ...updatePostDto, modified_at: new Date() });
  }

  remove(id: number) {
    this.findOne(id);
    this.posts = this.posts.filter((u) => u.id !== id);
  }
}
