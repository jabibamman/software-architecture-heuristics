import { SetMetadata } from '@nestjs/common';
import { Role } from '@/modules/users/domain/value-objects/role.value-object';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
