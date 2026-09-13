import { landlordFormSchema } from '@/shared/validation/landlord.schema';

const validData = {
  fullName: 'Youssef Azizi',
  phone: '0612345678',
  email: 'youssef@studroom.ma',
  city: 'Nador',
  neighborhood: 'Selouane',
  propertyType: 'Studio',
  roomsCount: 1,
  surfaceSqm: 25,
  expectedRentDh: 1500,
  availabilityDate: '2025-09-01',
  message: 'Disponible immédiatement.',
};

describe('landlordFormSchema', () => {
  it('accepts a fully valid payload', () => {
    const result = landlordFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts payload without optional fields (surfaceSqm, message)', () => {
    const { surfaceSqm, message, ...minimal } = validData;
    const result = landlordFormSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it('rejects when fullName is too short', () => {
    const result = landlordFormSchema.safeParse({ ...validData, fullName: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = landlordFormSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.errors.map(e => e.path[0]);
      expect(fields).toContain('email');
    }
  });

  it('rejects a phone number that is too short', () => {
    const result = landlordFormSchema.safeParse({ ...validData, phone: '0612' });
    expect(result.success).toBe(false);
  });

  it('rejects expectedRentDh below 500', () => {
    const result = landlordFormSchema.safeParse({ ...validData, expectedRentDh: 100 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.errors.map(e => e.path[0]);
      expect(fields).toContain('expectedRentDh');
    }
  });

  it('rejects roomsCount of 0', () => {
    const result = landlordFormSchema.safeParse({ ...validData, roomsCount: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects empty city', () => {
    const result = landlordFormSchema.safeParse({ ...validData, city: 'X' });
    expect(result.success).toBe(false);
  });

  it('rejects empty availabilityDate', () => {
    const result = landlordFormSchema.safeParse({ ...validData, availabilityDate: '' });
    expect(result.success).toBe(false);
  });
});
