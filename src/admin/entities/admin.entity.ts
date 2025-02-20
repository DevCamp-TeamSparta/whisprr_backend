import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('admins')
export class AdminEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;
}
