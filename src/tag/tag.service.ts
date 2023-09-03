import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });

    if (!tag) {
      const newTag = new Tag();
      newTag.name = createTagDto.name;
      return await this.tagRepository.save(newTag);
    }

    return tag;
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOne(id: number) {
    const returned = await this.tagRepository.findOne({ where: { id } });
    if (!returned) throw new NotFoundException();
    return returned;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    await this.findOne(id);
    return await this.tagRepository.update({ id }, { ...updateTagDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.tagRepository.delete({ id });
  }
}
