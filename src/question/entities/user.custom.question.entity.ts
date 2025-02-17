import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';
import { QuestionEntity } from './question.entity';

@Entity('user_custom_questions')
@Unique(['user', 'questions'])
export class CustomQuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  customed_question: string;

  // m : 1 user
  @ManyToOne(() => UserEntity, (user) => user.user_custom_questions, { onDelete: 'CASCADE' })
  user: UserEntity;

  //m: 1 question
  @ManyToOne(() => QuestionEntity, (question) => question.user_custom_questions)
  questions: QuestionEntity;
}
