import { auditRepository, CreateAuditLogParams } from '../repositories/audit.repository';
import { DbAuditLog } from '../shared/types/database';

export class AuditService {
  async record(params: CreateAuditLogParams): Promise<DbAuditLog> {
    return auditRepository.createLog(params);
  }

  async getLogs(limit = 100, offset = 0): Promise<DbAuditLog[]> {
    return auditRepository.findAllLogs(limit, offset);
  }
}

export const auditService = new AuditService();
