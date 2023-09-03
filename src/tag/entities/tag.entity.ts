import { Post } from '../../post/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity({ schema: 'dev-blog-db', name: 'tag' })
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name' })
  name: string;

  // @ManyToMany(() => Post, (post) => post.tags)
  // posts: Post[];
}
