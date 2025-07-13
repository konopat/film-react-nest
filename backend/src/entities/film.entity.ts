import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating: number;

  @Column({ type: 'varchar', length: 255 })
  director: string;

  @Column({ type: 'text', array: true })
  tags: string[];

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 500 })
  image: string;

  @Column({ type: 'varchar', length: 500 })
  cover: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
