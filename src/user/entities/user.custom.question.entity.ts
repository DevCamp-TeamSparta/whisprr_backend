import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('user_custom_questions')
export class CustomQuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  question_number: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  question: string;

  @Column({ type: 'timestamp', nullable: false })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  // m : 1 user
  @OneToMany(() => UserEntity, (user) => user.user_custom_questions, { onDelete: 'CASCADE' })
  user: UserEntity;
}
