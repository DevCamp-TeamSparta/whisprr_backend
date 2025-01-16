import { UserEntitiy } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';

@Entity('journals')
export class JournalEntity {
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

  @Column({ type: 'json', nullable: false })
  content: object;

  @Column({ type: 'timestamp', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // m:1 user
  @OneToMany(() => UserEntitiy, (user) => user.journals)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: UserEntitiy;
}
