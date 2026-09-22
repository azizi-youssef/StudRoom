import { getSupabaseAdmin } from '../config/supabase';
import { DbUser, UserRole, UserStatus } from '../shared/types/database';

const IN_MEMORY_USERS: DbUser[] = [
  {
    id: 'u0000000-0000-0000-0000-000000000001',
    email: 'admin@studroom.ma',
    role: 'admin',
    status: 'ACTIVE',
    full_name: 'Administrateur Principal',
    phone: '+212 612 345 678',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u0000000-0000-0000-0000-000000000002',
    email: 'bailleur.selouane@studroom.ma',
    role: 'landlord',
    status: 'ACTIVE',
    full_name: 'Hassan El Amrani (Bailleur)',
    phone: '+212 661 223 344',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u0000000-0000-0000-0000-000000000003',
    email: 'etudiant.fsan@gmail.com',
    role: 'student',
    status: 'ACTIVE',
    full_name: 'Youssef Bakkali (Étudiant FSAN)',
    phone: '+212 670 998 877',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class UserRepository {
  async findAllUsers(role?: string, status?: string): Promise<DbUser[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        let query = supabase.from('users').select('*').order('created_at', { ascending: false });
        if (role && role !== 'all') {
          query = query.eq('role', role);
        }
        if (status && status !== 'all') {
          query = query.eq('status', status);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as DbUser[];
        }
      } catch {
        // Fallback to in-memory users
      }
    }

    let list = [...IN_MEMORY_USERS];
    if (role && role !== 'all') list = list.filter((u) => u.role === role);
    if (status && status !== 'all') list = list.filter((u) => u.status === status);
    return list;
  }

  async findUserById(id: string): Promise<DbUser | null> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
        if (!error && data) return data as DbUser;
      } catch {
        // Fallback
      }
    }
    return IN_MEMORY_USERS.find((u) => u.id === id) ?? null;
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<DbUser> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({ status, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error updating user status: ${error.message}`);
      }
      return data as DbUser;
    }

    const user = IN_MEMORY_USERS.find((u) => u.id === id);
    if (user) {
      user.status = status;
      user.updated_at = now;
      return user;
    }
    throw new Error('User not found');
  }

  async updateUserRole(id: string, role: UserRole): Promise<DbUser> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({ role, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error updating user role: ${error.message}`);
      }
      return data as DbUser;
    }

    const user = IN_MEMORY_USERS.find((u) => u.id === id);
    if (user) {
      user.role = role;
      user.updated_at = now;
      return user;
    }
    throw new Error('User not found');
  }
}

export const userRepository = new UserRepository();
