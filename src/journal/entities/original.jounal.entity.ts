import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('original_journals')
export class OriginalJournalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  keyword: string[];

  @Column({ type: 'longtext', nullable: false })
  content: string;
}
