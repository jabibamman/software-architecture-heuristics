import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SlotId } from '../value-objects/slot-id';
import { User } from '@/modules/users/domain/entities/user.entity';

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
  checkedIn!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  checkedInAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  checkedOutAt?: Date;

  @Column({ nullable: true, length: 255 })
  notes?: string;

  @Column({ default: false })
  needsCharger!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (u) => u.reservations, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('uuid')
  userId!: string;

  static create(
    userId: string,
    slotId: string,
    startDate: Date,
    endDate: Date,
    needsCharger: boolean,
    notes?: string,
  ): Reservation {
    const r = new Reservation();
    const slotIdValue = SlotId.create(slotId);

    r.userId = userId;
    r.slotId = slotIdValue.toString();
    r.startDate = startDate;
    r.endDate = endDate;
    r.needsCharger = needsCharger;
    r.notes = notes;
    r.checkedIn = false;
    // r.checkedInAt / checkedOutAt =  undefined
    return r;
  }

  public getSlotId(): SlotId {
    return SlotId.create(this.slotId);
  }
}
