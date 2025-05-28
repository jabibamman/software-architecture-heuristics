import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 3 })
  slotId!: string;

  @Column({ type: 'timestamptz' })
  startDate!: Date;

  @Column({ type: 'timestamptz' })
  endDate!: Date;

  @Column({ default: false })
  needsCharger!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
