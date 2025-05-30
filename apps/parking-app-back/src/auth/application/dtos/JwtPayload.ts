import { User } from '@/users/domain/entities/user.entity';

export class JwtPayload {
  userId: string;
  email: string;

  static from(user: User): JwtPayload {
    return {
      userId: user.id,
      email: user.email,
    };
  }
}
