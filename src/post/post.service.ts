import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FindPostDto } from './dto/find-post.dto';

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

  async findAll(findPostDto: FindPostDto) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post.id',
        'post.draft',
        'post.tags',
        'post.title',
        'post.content',
        'post.created_at',
        'post.modified_at',
        'category.id',
        'category.name',
      ])
      .orderBy('post.modified_at', 'DESC');

    if (findPostDto.categoryName) {
      query.andWhere('category.name = :categoryName', {
        categoryName: findPostDto.categoryName,
      });
    }

    const [list, total] = await query
      .skip((findPostDto.page - 1) * findPostDto.limit)
      .take(findPostDto.limit)
      .getManyAndCount();

    return {
      total,
      page: findPostDto.page,
      data: list,
    };
  }

  async findOne(id: number) {
    const returned = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .select([
        'post.id',
        'post.draft',
        'post.tags',
        'post.title',
        'post.content',
        'post.created_at',
        'post.modified_at',
        'category.id',
        'category.name',
      ])
      .where('post.id = :id', { id })
      .getOne();
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
