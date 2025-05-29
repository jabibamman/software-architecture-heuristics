import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Reservation } from '@/reservations/domain/entities/reservation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @OneToMany(() => Reservation, (r) => r.user)
  reservations?: Reservation[];
}
