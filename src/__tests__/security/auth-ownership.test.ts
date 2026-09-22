import { propertyService } from '../../../backend/src/services/property.service';

describe('Security & Landlord Ownership Isolation', () => {
  it('should verify that a landlord cannot claim another landlord property', async () => {
    // Property 'prop-al-omrane-01' has landlord_id = 'landlord-1'
    const isOwner = await propertyService.verifyLandlordOwnership(
      'prop-al-omrane-01',
      'malicious-attacker-landlord-id'
    );
    expect(isOwner).toBe(false);
  });

  it('should confirm that service_role is not exposed in public environment variables', () => {
    // Check that neither NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY nor process.env in client exposes service_role
    expect(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    expect(process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY).toBeUndefined();
  });
});
