import { userRepository } from '../repositories/user.repository';
import { auditService } from './audit.service';
import { DbUser, UserRole, UserStatus } from '../shared/types/database';
import { AppError } from '../lib/response';

export class UserAdminService {
  async listUsers(role?: string, status?: string): Promise<DbUser[]> {
    return userRepository.findAllUsers(role, status);
  }

  async getUser(id: string): Promise<DbUser> {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Utilisateur introuvable.');
    }
    return user;
  }

  async changeStatus(
    id: string,
    status: UserStatus,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<DbUser> {
    const existing = await this.getUser(id);

    // Prevent blocking oneself
    if (actorUserId && actorUserId === id && status !== 'ACTIVE') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Vous ne pouvez pas suspendre ou bloquer votre propre compte administrateur.');
    }

    const updated = await userRepository.updateUserStatus(id, status);

    await auditService.record({
      actorUserId,
      action: 'CHANGE_USER_STATUS',
      entityType: 'user',
      entityId: id,
      oldValue: { status: existing.status },
      newValue: { status: updated.status },
      ipAddress,
    });

    return updated;
  }

  async changeRole(
    id: string,
    role: UserRole,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<DbUser> {
    const existing = await this.getUser(id);

    // Prevent demoting oneself
    if (actorUserId && actorUserId === id && role !== 'admin') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Vous ne pouvez pas rétrograder votre propre rôle administrateur.');
    }

    const updated = await userRepository.updateUserRole(id, role);

    await auditService.record({
      actorUserId,
      action: 'CHANGE_USER_ROLE',
      entityType: 'user',
      entityId: id,
      oldValue: { role: existing.role },
      newValue: { role: updated.role },
      ipAddress,
    });

    return updated;
  }
}

export const userAdminService = new UserAdminService();
