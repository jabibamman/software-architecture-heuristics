import { User } from '@/users/domain/entities/user.entity';

export class JwtPayload {
  userId!: string;
  email!: string;

  static from(user: User): JwtPayload {
    const payload = new JwtPayload();
    payload.userId = user.id;
    payload.email = user.email;
    return payload;
  }
}
