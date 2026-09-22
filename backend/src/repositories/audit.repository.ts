import { getSupabaseAdmin } from '../config/supabase';
import { DbAuditLog } from '../shared/types/database';

// In-memory fallback for local dev or testing
const IN_MEMORY_AUDIT_LOGS: DbAuditLog[] = [];

export interface CreateAuditLogParams {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

export class AuditRepository {
  async createLog(params: CreateAuditLogParams): Promise<DbAuditLog> {
    const supabase = getSupabaseAdmin();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const logEntry: DbAuditLog = {
      id,
      actor_user_id: params.actorUserId ?? null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      old_value: params.oldValue ?? null,
      new_value: params.newValue ?? null,
      ip_address: params.ipAddress ?? null,
      created_at: now,
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .insert({
            id: logEntry.id,
            actor_user_id: logEntry.actor_user_id,
            action: logEntry.action,
            entity_type: logEntry.entity_type,
            entity_id: logEntry.entity_id,
            old_value: logEntry.old_value,
            new_value: logEntry.new_value,
            ip_address: logEntry.ip_address,
          })
          .select()
          .single();

        if (!error && data) {
          return data as DbAuditLog;
        }
      } catch {
        // Fallback transparent to in-memory store
      }
    }

    IN_MEMORY_AUDIT_LOGS.unshift(logEntry);
    return logEntry;
  }

  async findAllLogs(limit = 100, offset = 0): Promise<DbAuditLog[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (!error && data) {
          return data as DbAuditLog[];
        }
      } catch {
        // Fallback transparent to in-memory store
      }
    }

    return IN_MEMORY_AUDIT_LOGS.slice(offset, offset + limit);
  }
}

export const auditRepository = new AuditRepository();
