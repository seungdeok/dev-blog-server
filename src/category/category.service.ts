import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();
    category.parent_id = createCategoryDto.parent_id;
    category.name = createCategoryDto.name;

    await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    const returned = await this.categoryRepository.findOne({ where: { id } });
    if (!returned) throw new NotFoundException();
    return returned;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    await this.categoryRepository.update({ id }, { ...updateCategoryDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.categoryRepository.delete({ id });
  }
}
