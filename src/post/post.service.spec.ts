import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { FindPostDto } from './dto/find-post.dto';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/entities/tag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const mockPostRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PostService', () => {
  let service: PostService;
  let tagService: TagService;
  let postRepository: MockRepository<Post>;
  let tagRepository: MockRepository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        TagService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    tagService = module.get<TagService>(TagService);
    postRepository = module.get<MockRepository<Post>>(getRepositoryToken(Post));
    tagRepository = module.get<MockRepository<Tag>>(getRepositoryToken(Tag));
  });

  it('Post 목록 조회', async () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        draft: 'test',
        title: 'title1',
        content: 'content1',
        created_at: new Date(),
        modified_at: new Date(),
        tags: [
          {
            id: 1,
            name: 'dev',
          },
          {
            id: 2,
            name: 'BE',
          },
          {
            id: 3,
            name: 'FE',
          },
        ],
      },
      {
        id: 2,
        draft: 'test',
        title: 'title2',
        content: 'content2',
        created_at: new Date(),
        modified_at: new Date(),
        tags: [
          {
            id: 1,
            name: 'dev',
          },
          {
            id: 2,
            name: 'BE',
          },
          {
            id: 3,
            name: 'FE',
          },
        ],
      },
      {
        id: 3,
        draft: 'test',
        title: 'title3',
        content: 'content3',
        created_at: new Date(),
        modified_at: new Date(),
        tags: [
          {
            id: 1,
            name: 'dev',
          },
          {
            id: 2,
            name: 'BE',
          },
          {
            id: 3,
            name: 'FE',
          },
        ],
      },
    ];

    jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([mockPosts, mockPosts.length]),
    });

    const findPostDto: FindPostDto = {
      page: 1,
      limit: 10,
      tagName: '',
    };

    const posts = await service.findAll(findPostDto);

    expect(posts.total).toBe(mockPosts.length);
    expect(posts.page).toBe(findPostDto.page);
    expect(posts.data).toEqual(mockPosts);
  });

  it('Post 상세 조회', async () => {
    const mockPost: Post = {
      id: 1,
      draft: 'test',
      title: 'title1',
      content: 'content1',
      created_at: new Date(),
      modified_at: new Date(),
      tags: [
        {
          id: 1,
          name: 'dev',
        },
        {
          id: 2,
          name: 'BE',
        },
        {
          id: 3,
          name: 'FE',
        },
      ],
    };

    jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockPost),
    });

    const post = await service.findOne(1);

    expect(post.id).toBe(1);
    expect(post.title).toBe('title1');
    expect(post.draft).toBe('test');
    expect(post.content).toBe('content1');
    expect(post.tags).toEqual(mockPost.tags);
  });

  it('Post 생성', async () => {
    const createPostDto: CreatePostDto = {
      draft: 'test',
      tags: ['dev', 'BE', 'FE'],
      title: 'title1',
      content: 'content1',
    };

    const mockTag1 = { id: 1, name: 'dev' };
    const mockTag2 = { id: 2, name: 'BE' };
    const mockTag3 = { id: 3, name: 'FE' };

    jest
      .spyOn(tagService, 'create')
      .mockResolvedValueOnce(mockTag1)
      .mockResolvedValueOnce(mockTag2)
      .mockResolvedValueOnce(mockTag3);

    const spyOnSave = jest
      .spyOn(tagRepository, 'save')
      .mockResolvedValue({ id: 1, ...createPostDto });

    const createdPost = await service.create({ ...createPostDto });

    expect(tagService.create).toHaveBeenCalledWith({ name: 'dev' });
    expect(tagService.create).toHaveBeenCalledWith({ name: 'BE' });
    expect(tagService.create).toHaveBeenCalledWith({ name: 'FE' });
    expect(postRepository.save).toHaveBeenCalledWith({
      ...createPostDto,
      tags: [mockTag1, mockTag2, mockTag3],
    });

    expect(spyOnSave).toHaveBeenCalledWith({
      ...createPostDto,
      tags: [mockTag1, mockTag2, mockTag3],
    });
    expect(createdPost).toEqual({
      id: 1,
      ...createPostDto,
    });
  });

  it('Post 수정', async () => {
    const mockPost: Post = {
      id: 1,
      draft: 'test',
      title: 'title1',
      content: 'content1',
      created_at: new Date(),
      modified_at: new Date(),
      tags: [
        {
          id: 1,
          name: 'dev',
        },
        {
          id: 2,
          name: 'BE',
        },
        {
          id: 3,
          name: 'FE',
        },
      ],
    };

    const updatePostDto: UpdatePostDto = {
      draft: 'test',
      title: 'title2',
      content: 'content1',
      tags: ['dev', 'BE', 'FE'],
    };
    const spyOnFindOne = jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mockPost);
    jest.spyOn(postRepository, 'save').mockResolvedValue({
      ...mockPost,
      ...updatePostDto,
      tags: mockPost.tags,
    });
    const updatedPost = await service.update(1, updatePostDto);

    expect(spyOnFindOne).toHaveBeenCalledWith(1);
    expect(updatedPost).toBeDefined();
    expect(updatedPost.title).toEqual(updatePostDto.title);
  });

  it('Post 삭제', async () => {
    const mockPost: Post = {
      id: 1,
      draft: 'test',
      title: 'title1',
      content: 'content1',
      created_at: new Date(),
      modified_at: new Date(),
      tags: [
        {
          id: 1,
          name: 'dev',
        },
        {
          id: 2,
          name: 'BE',
        },
        {
          id: 3,
          name: 'FE',
        },
      ],
    };

    const spyOnFindOne = jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mockPost);

    const spyOnDelete = jest
      .spyOn(postRepository, 'delete')
      .mockResolvedValue({ affected: 1 });

    const deletedTag = await service.remove(1);
    expect(spyOnFindOne).toHaveBeenCalledWith(1);
    expect(spyOnDelete).toHaveBeenCalledWith({ id: 1 });
    expect(deletedTag).toBeDefined();
    expect(deletedTag.affected).toEqual(1);
  });
});
