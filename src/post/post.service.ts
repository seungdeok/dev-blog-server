import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FindPostDto } from './dto/find-post.dto';
import { TagService } from '../tag/tag.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly tagService: TagService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const newPost = new Post();
    newPost.title = createPostDto.title;
    newPost.content = createPostDto.content;
    newPost.draft = createPostDto.draft;
    newPost.tags = [];

    await Promise.all(
      createPostDto.tags.map(async (tagName) => {
        const newTag = await this.tagService.create({ name: tagName });
        newPost.tags.push(newTag);
      }),
    );

    return await this.postRepository.save(newPost);
  }

  async findAll(findPostDto: FindPostDto) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tags')
      .select([
        'post.id',
        'post.draft',
        'post.title',
        'post.content',
        'post.created_at',
        'post.modified_at',
        'tags.id',
        'tags.name',
      ])
      .orderBy('post.modified_at', 'DESC');

    if (findPostDto.tagName) {
      query.andWhere('tags.name = :tagName', {
        tagName: findPostDto.tagName,
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
      .leftJoinAndSelect('post.tags', 'tags')
      .select([
        'post.id',
        'post.draft',
        'post.title',
        'post.content',
        'post.created_at',
        'post.modified_at',
        'tags.id',
        'tags.name',
      ])
      .where('post.id = :id', { id })
      .getOne();
    if (!returned) throw new NotFoundException();
    return returned;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    post.title = updatePostDto.title;
    post.content = updatePostDto.content;
    post.draft = updatePostDto.draft;
    post.tags = [];

    await Promise.all(
      updatePostDto.tags.map(async (tagName) => {
        const newTag = await this.tagService.create({ name: tagName });
        post.tags.push(newTag);
      }),
    );

    return await this.postRepository.save(post);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.postRepository.delete({ id });
  }
}
