import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../../reservations/domain/entities/reservation.entity';
import { Role } from '../value-objects/role.value-object';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
  role!: Role;

  @OneToMany(() => Reservation, (r) => r.user)
  reservations?: Reservation[];
}
