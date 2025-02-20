import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('admins')
export class AdminEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  email: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  password: string;
}
