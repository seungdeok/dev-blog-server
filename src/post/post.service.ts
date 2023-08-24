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

  async create(createPostDto: CreatePostDto) {
    const post = new Post();
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.category_id = createPostDto.category_id;
    post.tags = createPostDto.tags;
    post.draft = createPostDto.draft;

    await this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    const returned = await this.postRepository.findOne({ where: { id } });
    if (!returned) throw new NotFoundException();
    return returned;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    await this.postRepository.update({ id }, { ...updatePostDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.postRepository.delete({ id });
  }
}
