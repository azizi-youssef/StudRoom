import { propertyRepository } from '../repositories/property.repository';
import { bookingRepository } from '../repositories/booking.repository';
import { auditService } from './audit.service';
import { PropertyDetail } from '../shared/types';
import { AppError } from '../lib/response';
import { getSupabaseAdmin } from '../config/supabase';

export class LandlordConversionService {
  async convertSubmission(
    submissionId: string,
    overrides?: {
      title?: string;
      city_id?: string;
      rooms_count?: number;
      monthly_price_dh?: number;
      surface_sqm?: number;
    },
    actorUserId?: string,
    ipAddress?: string
  ): Promise<PropertyDetail> {
    const submissions = await bookingRepository.findAllLandlordSubmissions();
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) {
      throw new AppError(404, 'NOT_FOUND', 'Proposition de propriétaire introuvable.');
    }

    // Match or resolve city
    const cities = await propertyRepository.findAllCities();
    let city = cities.find(
      (c) => c.name.toLowerCase() === sub.city.toLowerCase() || c.slug === sub.city.toLowerCase()
    );
    if (overrides?.city_id) {
      city = cities.find((c) => c.id === overrides.city_id) ?? city;
    }
    if (!city) {
      city = cities[0]; // Default to first active city (Selouane)
    }

    // Check if landlord account exists
    let landlordId: string | null = null;
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: landlordData } = await supabase
          .from('landlords')
          .select('id')
          .eq('email', sub.email)
          .maybeSingle();

        if (landlordData) {
          landlordId = landlordData.id;
        }
      } catch {
        // Fallback
      }
    }

    const roomsCount = overrides?.rooms_count ?? sub.rooms_count ?? 1;
    const surfaceSqm = overrides?.surface_sqm ?? sub.surface_sqm ?? 80;
    const totalRent = overrides?.monthly_price_dh ?? sub.expected_rent_dh ?? 2000;
    const roomPrice = Math.round(totalRent / Math.max(1, roomsCount));
    const roomSurface = Math.round(surfaceSqm / Math.max(1, roomsCount));

    const title =
      overrides?.title?.trim() ||
      `Appartement ${sub.neighborhood} (${sub.full_name})`;

    const description =
      sub.message?.trim() ||
      `Logement étudiant proposé par ${sub.full_name} situé à ${sub.neighborhood}, ${city.name}. Disponible dès le ${sub.availability_date}.`;

    // 1. Create property
    const property = await propertyRepository.createProperty({
      title,
      description,
      city_id: city.id,
      neighborhood: sub.neighborhood,
      address: `${sub.neighborhood}, ${city.name}`,
      property_type: (['apartment', 'house', 'residence', 'studio', 'building'].includes(sub.property_type)
        ? sub.property_type
        : 'apartment') as any,
      surface_sqm: surfaceSqm,
      min_price_dh: roomPrice,
      max_price_dh: roomPrice,
      total_rooms: roomsCount,
      available_rooms: roomsCount,
      status: 'AVAILABLE',
      featured: false,
      is_available: true,
      landlord_id: landlordId,
      amenity_ids: [],
      image_urls: ['/images/studroom_hero.jpg'],
    });

    // 2. Add initial image
    await propertyRepository.addPropertyImage(
      property.id,
      '/images/studroom_hero.jpg',
      `Vue du logement ${title}`,
      true,
      1
    );

    // 3. Create rooms
    for (let i = 1; i <= roomsCount; i++) {
      await propertyRepository.createRoom(property.id, {
        name: `Chambre ${i}`,
        room_type: 'PRIVATE',
        price_monthly: roomPrice,
        deposit_dh: roomPrice,
        surface_sqm: roomSurface,
        furnished: true,
        floor: 1,
        status: 'AVAILABLE',
        available_from: sub.availability_date,
        images: [],
        features: [],
      });
    }

    // 4. Mark submission as approved
    await bookingRepository.updateLandlordSubmissionStatus(submissionId, 'approved');

    // 5. Record Audit
    await auditService.record({
      actorUserId,
      action: 'CONVERT_LANDLORD_SUBMISSION',
      entityType: 'property',
      entityId: property.id,
      newValue: {
        submission_id: submissionId,
        property_id: property.id,
        landlord_email: sub.email,
        rooms_count: roomsCount,
      },
      ipAddress,
    });

    const refreshed = await propertyRepository.findPropertyById(property.id);
    return refreshed ?? property;
  }
}

export const landlordConversionService = new LandlordConversionService();
