import { DbUser, UserRole } from '../shared/types/database';
import { getSupabase, getSupabaseAdmin } from '../config/supabase';

// Mock in-memory storage for development fallback
const mockUsers: DbUser[] = [
  {
    id: 'user-demo-student-01',
    email: 'etudiant@studroom.ma',
    role: 'student',
    full_name: 'Karim El Amrani',
    phone: '+212 634 536 286',
    // hashed password for 'password123'
    password_hash: '$2a$10$7v50o/k7kPj5QfJp4W/f.OaC76i8P0s2rM1s.5W5W5W5W5W5W5W5W', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class AuthRepository {
  async findUserByEmail(email: string): Promise<DbUser | null> {
    const supabase = getSupabaseAdmin() ?? getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();
      if (error) {
        console.error('[SUPABASE ERROR] findUserByEmail failed:', error.message);
      } else if (data) {
        return data as DbUser;
      }
    }
    return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) ?? null;
  }

  async findUserById(id: string): Promise<DbUser | null> {
    const supabase = getSupabaseAdmin() ?? getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
      if (error) {
        console.error('[SUPABASE ERROR] findUserById failed:', error.message);
      } else if (data) {
        return data as DbUser;
      }
    }
    return mockUsers.find((u) => u.id === id) ?? null;
  }

  async createUser(userData: {
    id?: string;
    email: string;
    role: UserRole;
    full_name: string;
    phone: string;
    password_hash: string;
    avatar_url?: string;
  }): Promise<DbUser> {
    const supabase = getSupabaseAdmin() ?? getSupabase();
    const cleanEmail = userData.email.toLowerCase().trim();

    if (supabase) {
      const dbPayload: Record<string, any> = {
        email: cleanEmail,
        role: userData.role,
        full_name: userData.full_name,
        phone: userData.phone,
        password_hash: userData.password_hash,
      };
      if (userData.id) {
        dbPayload.id = userData.id;
      }
      if (userData.avatar_url) {
        dbPayload.avatar_url = userData.avatar_url;
      }

      const { data, error } = await supabase.from('users').insert([dbPayload]).select().single();
      if (error) {
        console.error('[SUPABASE ERROR] createUser failed:', error.message, error.details);
      } else if (data) {
        console.log('[SUPABASE SUCCESS] User created in database with ID:', data.id);
        
        // Auto-create role profile
        await this.ensureUserProfile(data.id, data.role, data.full_name, cleanEmail, data.phone);
        return data as DbUser;
      }
    }

    // In-memory fallback if Supabase table isn't created yet
    const newUser: DbUser = {
      id: userData.id || 'user-' + Math.floor(100000 + Math.random() * 900000),
      email: cleanEmail,
      role: userData.role,
      full_name: userData.full_name,
      phone: userData.phone,
      password_hash: userData.password_hash,
      avatar_url: userData.avatar_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  async createOAuthUser(data: {
    id?: string;
    email: string;
    full_name: string;
    role?: UserRole;
    phone?: string;
    avatar_url?: string;
  }): Promise<DbUser> {
    const supabase = getSupabaseAdmin() ?? getSupabase();
    const cleanEmail = data.email.toLowerCase().trim();
    const role: UserRole = data.role || 'student';
    const phone = data.phone || '+212 600 000 000';

    if (supabase) {
      const dbPayload: Record<string, any> = {
        email: cleanEmail,
        role,
        full_name: data.full_name || 'Utilisateur StudRoom',
        phone,
        password_hash: null,
      };
      if (data.id) {
        dbPayload.id = data.id;
      }
      if (data.avatar_url) {
        dbPayload.avatar_url = data.avatar_url;
      }

      const { data: dbUser, error } = await supabase.from('users').insert([dbPayload]).select().single();
      if (error) {
        console.error('[SUPABASE ERROR] createOAuthUser failed:', error.message, error.details);
      } else if (dbUser) {
        console.log('[SUPABASE SUCCESS] OAuth User created in database with ID:', dbUser.id);
        
        // Auto-create role profile
        await this.ensureUserProfile(dbUser.id, role, dbPayload.full_name, cleanEmail, phone);
        return dbUser as DbUser;
      }
    }

    const newUser: DbUser = {
      id: data.id || 'user-' + Math.floor(100000 + Math.random() * 900000),
      email: cleanEmail,
      role,
      full_name: data.full_name || 'Utilisateur StudRoom',
      phone,
      password_hash: '',
      avatar_url: data.avatar_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  /**
   * Assure la création du profil étudiant ou propriétaire associé
   */
  private async ensureUserProfile(
    userId: string,
    role: UserRole,
    fullName: string,
    email: string,
    phone: string
  ): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;

    try {
      if (role === 'student') {
        const parts = fullName.trim().split(/\s+/);
        const firstName = parts[0] || 'Étudiant';
        const lastName = parts.slice(1).join(' ') || 'StudRoom';

        await supabase.from('students').upsert(
          {
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
          },
          { onConflict: 'user_id' }
        );
      } else if (role === 'landlord') {
        await supabase.from('landlords').upsert(
          {
            user_id: userId,
            name: fullName,
            email,
            phone,
          },
          { onConflict: 'user_id' }
        );
      }
    } catch (err: any) {
      console.warn('[AUTH] ensureUserProfile error (non-fatal):', err?.message);
    }
  }

}

export const authRepository = new AuthRepository();
