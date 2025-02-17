import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CustomQuestionEntity } from './user.custom.question.entity';

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;

  //1: m user_custom_questions
  @OneToMany(() => CustomQuestionEntity, (user_custom_questions) => user_custom_questions.questions)
  user_custom_questions: CustomQuestionEntity[];
}
