import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { JournalEntity } from './journal.entity';

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

  @OneToOne(() => JournalEntity, (journal) => journal.originalJournal, {
    onDelete: 'CASCADE',
  })
  journal: JournalEntity;
}
