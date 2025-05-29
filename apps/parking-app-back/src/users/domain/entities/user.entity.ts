import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from '../../../reservations/domain/entities/reservation.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => Reservation, (r) => r.user)
  reservations?: Reservation[];
}
