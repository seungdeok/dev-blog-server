import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'dev-blog-db', name: 'category' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'parent_id' })
  parent_id: number;

  @Column('varchar', { name: 'name' })
  name: string;
}
