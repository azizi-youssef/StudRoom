import {
  adminCreatePropertySchema,
  adminCreateRoomSchema,
  adminUpdateRoomStatusSchema,
  adminConvertSubmissionSchema,
  adminScheduleVisitSchema,
  adminUpdateUserStatusSchema,
  adminUpdateUserRoleSchema,
} from '@/shared/schemas/admin.schema';

describe('Admin Back-Office Schemas & Validation', () => {
  describe('adminCreatePropertySchema', () => {
    it('validates a valid property payload', () => {
      const validPayload = {
        title: 'Résidence Universitaire Al Omrane',
        description: 'Superbe résidence moderne pour étudiants avec tous les équipements.',
        city_id: '11111111-1111-1111-1111-111111111111',
        neighborhood: 'Hay Al Omrane',
        property_type: 'apartment',
        address: 'Boulevard Hassan II',
        surface_sqm: 120,
        status: 'AVAILABLE',
        amenity_ids: ['22222222-2222-2222-2222-222222222222'],
      };

      const result = adminCreatePropertySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('rejects a property missing required city_id', () => {
      const invalidPayload = {
        title: 'Résidence Test',
        description: 'Superbe résidence moderne pour étudiants.',
        neighborhood: 'Centre',
        property_type: 'apartment',
      };

      const result = adminCreatePropertySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('adminCreateRoomSchema', () => {
    it('validates a valid room payload', () => {
      const roomPayload = {
        name: 'Chambre 101 - Master Suite',
        room_type: 'PRIVATE',
        price_monthly: 2100,
        deposit_dh: 2100,
        surface_sqm: 16,
        furnished: true,
        floor: 1,
        status: 'AVAILABLE',
      };

      const result = adminCreateRoomSchema.safeParse(roomPayload);
      expect(result.success).toBe(true);
    });

    it('rejects negative monthly price', () => {
      const roomPayload = {
        name: 'Chambre Invalide',
        room_type: 'PRIVATE',
        price_monthly: -500,
        deposit_dh: 20,
        surface_sqm: 10,
        furnished: true,
      };

      const result = adminCreateRoomSchema.safeParse(roomPayload);
      expect(result.success).toBe(false);
    });

  });

  describe('adminUpdateRoomStatusSchema', () => {
    it('accepts valid statuses', () => {
      const validStatuses = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE'];
      for (const status of validStatuses) {
        const res = adminUpdateRoomStatusSchema.safeParse({ status });
        expect(res.success).toBe(true);
      }
    });

    it('rejects unknown status', () => {
      const res = adminUpdateRoomStatusSchema.safeParse({ status: 'UNKNOWN_STATUS' });
      expect(res.success).toBe(false);
    });
  });

  describe('adminScheduleVisitSchema', () => {
    it('accepts valid ISO datetime string', () => {
      const res = adminScheduleVisitSchema.safeParse({
        visit_date: '2026-10-15T14:30:00Z',
        visit_notes: 'Accompagnement par agent terrain',
      });
      expect(res.success).toBe(true);
    });

    it('rejects empty visit date', () => {
      const res = adminScheduleVisitSchema.safeParse({
        visit_date: '',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('adminUpdateUserStatusSchema & Role', () => {
    it('validates user status transitions', () => {
      expect(adminUpdateUserStatusSchema.safeParse({ status: 'ACTIVE' }).success).toBe(true);
      expect(adminUpdateUserStatusSchema.safeParse({ status: 'SUSPENDED' }).success).toBe(true);
      expect(adminUpdateUserStatusSchema.safeParse({ status: 'BLOCKED' }).success).toBe(true);
      expect(adminUpdateUserStatusSchema.safeParse({ status: 'DELETED' }).success).toBe(false);
    });

    it('validates user role updates', () => {
      expect(adminUpdateUserRoleSchema.safeParse({ role: 'admin' }).success).toBe(true);
      expect(adminUpdateUserRoleSchema.safeParse({ role: 'landlord' }).success).toBe(true);
      expect(adminUpdateUserRoleSchema.safeParse({ role: 'student' }).success).toBe(true);
      expect(adminUpdateUserRoleSchema.safeParse({ role: 'superadmin' }).success).toBe(false);
    });
  });
});
