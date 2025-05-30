import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepositoryPort } from '../ports/user.repository.port';
import * as bcrypt from 'bcrypt';
import { Role } from '../../domain/value-objects/role.value-object';
import { User } from '../../domain/entities/user.entity';

interface SeedUser {
  email: string;
  password: string;
  role: Role;
}

@Injectable()
export class CreateInitialUserUseCase {
  private readonly logger = new Logger(CreateInitialUserUseCase.name);

  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepo: UserRepositoryPort,
  ) {}

  private seeds: SeedUser[] = [
    {
      email: 'manager@parkease.com',
      password: 'Manager123!',
      role: Role.MANAGER,
    },
    {
      email: 'secretary@parkease.com',
      password: 'Secret123!',
      role: Role.SECRETARY,
    },
    {
      email: 'employee@parkease.com',
      password: 'Employee123!',
      role: Role.EMPLOYEE,
    },
  ];

  public async execute(): Promise<void> {
    for (const { email, password, role } of this.seeds) {
      const existing = await this.userRepo.findByEmail(email);
      if (existing) {
        this.logger.log(`User already exists: ${email} (${existing.role})`);
        continue;
      }
      const u = new User();
      u.email = email.toLowerCase();
      u.password = await bcrypt.hash(password, 10);
      u.role = role;
      await this.userRepo.save(u);
      this.logger.log(`Seeded ${role} => ${email}`);
    }
  }
}
