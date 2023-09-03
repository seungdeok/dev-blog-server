import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';

const mockPostRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TagService', () => {
  let service: TagService;
  let tagRepository: MockRepository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useValue: mockPostRepository(),
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    tagRepository = module.get<MockRepository<Tag>>(getRepositoryToken(Tag));
  });

  it('Tag 목록 조회', async () => {
    const mockTags: Tag[] = [
      {
        id: 1,
        name: 'TestTag1',
      },
      {
        id: 2,
        name: 'TestTag2',
      },
      {
        id: 3,
        name: 'TestTag3',
      },
    ];

    const spyOnFindOne = jest
      .spyOn(tagRepository, 'find')
      .mockResolvedValue(mockTags);

    const tags = await service.findAll();

    expect(spyOnFindOne).toHaveBeenCalledWith();

    expect(tags.length).toEqual(mockTags.length);
  });

  it('Tag 상세 조회', async () => {
    const mockTag: Tag = {
      id: 1,
      name: 'TestTag',
    };

    const spyOnFindOne = jest
      .spyOn(tagRepository, 'findOne')
      .mockResolvedValue(mockTag);

    const tag = await service.findOne(1);

    expect(spyOnFindOne).toHaveBeenCalledWith({ where: { id: 1 } });

    expect(tag.id).toEqual(mockTag.id);
    expect(tag.name).toEqual(mockTag.name);
  });

  it('Tag 생성', async () => {
    const mockTag: Tag = {
      id: 1,
      name: 'TestTag',
    };

    const createTagDto: CreateTagDto = {
      name: 'TestTag',
    };

    const spyOnFindOne = jest
      .spyOn(tagRepository, 'findOne')
      .mockResolvedValue(null);

    const spyOnSave = jest
      .spyOn(tagRepository, 'save')
      .mockResolvedValue(mockTag);

    const createdTag = await service.create(createTagDto);

    expect(spyOnFindOne).toHaveBeenCalledWith({ where: { name: 'TestTag' } });
    expect(spyOnSave).toHaveBeenCalledWith({ name: 'TestTag' });

    expect(createdTag.id).toEqual(1);
    expect(createdTag.name).toEqual('TestTag');
  });

  it('Tag 수정', async () => {
    const mockTag = new Tag();
    mockTag.id = 1;
    mockTag.name = 'TestTag';

    const updateTagDto: UpdateTagDto = {
      name: 'UpdatedTestTag',
    };

    const spyOnFindOne = jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mockTag);

    const spyOnUpdate = jest
      .spyOn(tagRepository, 'update')
      .mockResolvedValue({ affected: 1 });

    const updatedTag = await service.update(1, updateTagDto);

    expect(spyOnFindOne).toHaveBeenCalledWith(1);
    expect(spyOnUpdate).toHaveBeenCalledWith({ id: 1 }, { ...updateTagDto });

    expect(updatedTag).toBeDefined();
    expect(updatedTag.affected).toEqual(1);
  });

  it('Tag 삭제', async () => {
    const mockTag = new Tag();
    mockTag.id = 1;
    mockTag.name = 'TestTag';

    const spyOnFindOne = jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mockTag);

    const spyOnDelete = jest
      .spyOn(tagRepository, 'delete')
      .mockResolvedValue({ affected: 1 });

    const deletedTag = await service.remove(1);

    expect(spyOnFindOne).toHaveBeenCalledWith(1);
    expect(spyOnDelete).toHaveBeenCalledWith({ id: 1 });

    expect(deletedTag).toBeDefined();
    expect(deletedTag.affected).toEqual(1);
  });
});
