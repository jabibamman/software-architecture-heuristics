import { User } from '@/modules/users/domain/entities/user.entity';
import { Role } from '@/modules/users/domain/value-objects/role.value-object';

export class JwtPayload {
  userId!: string;
  email!: string;
  role!: Role;

  static from(user: User): JwtPayload {
    const payload = new JwtPayload();
    payload.userId = user.id;
    payload.email = user.email;
    payload.role = user.role;
    return payload;
  }
}
