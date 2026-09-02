import { BookingFormValues } from '../shared/schemas/booking.schema';
import { LandlordFormValues } from '../shared/schemas/landlord.schema';
import { ContactFormValues } from '../shared/schemas/contact.schema';
import { getSupabaseAdmin } from '../config/supabase';
import { DbBookingRequest, DbLandlordSubmission, DbContactRequest, BookingStatus } from '../shared/types/database';


// In-memory fallbacks for development / demo
const mockBookings: any[] = [
  {
    id: 'SR-BOOK-482910',
    student_name: 'Karim El Amrani',
    student_email: 'karim.amrani@gmail.com',
    student_phone: '+212 634 536 286',
    university_name: 'Faculté Pluridisciplinaire de Nador (FSP Selouane)',
    study_level: 'Licence 1ère année',
    preferred_move_in_date: '2026-09-01',
    preferred_duration_months: 10,
    room_name: 'Chambre A — Executive Balcon',
    property_title: 'StudRoom Al Omrane 01',
    status: 'PENDING',
    created_at: new Date().toISOString(),
  },
  {
    id: 'SR-BOOK-319402',
    student_name: 'Fatima Zahra Mansouri',
    student_email: 'fz.mansouri@gmail.com',
    student_phone: '+212 612 345 678',
    university_name: 'École Supérieure de Technologie de Nador (EST Nador)',
    study_level: 'DUT 2ème année',
    preferred_move_in_date: '2026-09-05',
    preferred_duration_months: 12,
    room_name: 'Studio Privatifié 102',
    property_title: 'StudRoom Résidence Facultaire',
    status: 'APPROVED',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockLandlordSubmissions: any[] = [
  {
    id: 'SR-PROP-829102',
    full_name: 'Mohamed Bennani',
    email: 'm.bennani@gmail.com',
    phone: '+212 661 234 567',
    city: 'Selouane',
    neighborhood: 'Al Omrane Centre',
    property_type: 'apartment',
    rooms_count: 3,
    surface_sqm: 95,
    expected_rent_dh: 4500,
    availability_date: '2026-09-01',
    status: 'new',
    created_at: new Date().toISOString(),
  },
];

const mockContactRequests: any[] = [
  {
    id: 'SR-TKT-582910',
    full_name: 'Ayoub Toumi',
    email: 'ayoub.toumi@gmail.com',
    phone: '+212 677 889 900',
    subject: 'Demande de visite virtuelle',
    message: 'Bonjour, est-il possible de programmer une visite de la chambre A samedi après-midi ?',
    created_at: new Date().toISOString(),
  },
];

export class BookingRepository {
  async saveBooking(data: BookingFormValues, bookingId: string): Promise<DbBookingRequest> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const payload = {
        student_name: `${data.firstName} ${data.lastName}`,
        student_email: data.email,
        student_phone: data.phone,
        university_name: data.university,
        study_level: data.studyLevel,
        preferred_move_in_date: data.desiredArrivalDate,
        preferred_duration_months: data.durationMonths,
        room_id: data.roomId || null,
        message: data.message || null,
        status: 'PENDING',
      };
      const { data: dbData, error } = await supabase.from('booking_requests').insert([payload]).select().single();
      if (error) {
        console.error('[SUPABASE ERROR] booking_requests insert failed:', error.message);
      } else if (dbData) {
        return { ...dbData, bookingId: dbData.id || bookingId };
      }
    }

    const now = new Date().toISOString();
    const newBooking: DbBookingRequest = {
      id: bookingId,
      room_id: data.roomId || '',
      student_name: `${data.firstName} ${data.lastName}`,
      student_email: data.email,
      student_phone: data.phone,
      university_name: data.university,
      study_level: data.studyLevel,
      preferred_move_in_date: data.desiredArrivalDate,
      preferred_duration_months: data.durationMonths,
      message: data.message || undefined,
      status: 'PENDING',
      requested_at: now,
      created_at: now,
      updated_at: now,
    };
    mockBookings.unshift(newBooking);
    return newBooking;
  }

  async findAllBookings(): Promise<DbBookingRequest[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('booking_requests').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    return mockBookings;
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<DbBookingRequest | null> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('booking_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const item = mockBookings.find((b) => b.id === id);
    if (item) {
      item.status = status;
      item.updated_at = new Date().toISOString();
      return item;
    }
    return null;
  }

  async saveLandlordSubmission(data: LandlordFormValues, proposalId: string): Promise<any> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const payload = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        neighborhood: data.neighborhood,
        property_type: data.propertyType,
        rooms_count: data.roomsCount,
        surface_sqm: data.surfaceSqm || null,
        expected_rent_dh: data.expectedRentDh,
        availability_date: data.availabilityDate,
        message: data.message || null,
        status: 'new',
      };
      const { data: dbData, error } = await supabase.from('landlord_submissions').insert([payload]).select().single();
      if (error) {
        console.error('[SUPABASE ERROR] landlord_submissions insert failed:', error.message);
      } else if (dbData) {
        return { ...dbData, proposalId: dbData.id || proposalId };
      }
    }

    const newSub = {
      id: proposalId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      neighborhood: data.neighborhood,
      property_type: data.propertyType,
      rooms_count: data.roomsCount,
      surface_sqm: data.surfaceSqm,
      expected_rent_dh: data.expectedRentDh,
      availability_date: data.availabilityDate,
      message: data.message,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    mockLandlordSubmissions.unshift(newSub);
    return newSub;
  }

  async findAllLandlordSubmissions(): Promise<any[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('landlord_submissions').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    return mockLandlordSubmissions;
  }

  async updateLandlordSubmissionStatus(id: string, status: string): Promise<any> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('landlord_submissions')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const item = mockLandlordSubmissions.find((l) => l.id === id);
    if (item) {
      item.status = status;
      return item;
    }
    return null;
  }

  async saveContactRequest(data: ContactFormValues, ticketId: string): Promise<any> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const payload = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      };
      const { data: dbData, error } = await supabase.from('contact_requests').insert([payload]).select().single();
      if (error) {
        console.error('[SUPABASE ERROR] contact_requests insert failed:', error.message);
      } else if (dbData) {
        return { ...dbData, ticketId: dbData.id || ticketId };
      }
    }

    const newTicket = {
      id: ticketId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      created_at: new Date().toISOString(),
    };
    mockContactRequests.unshift(newTicket);
    return newTicket;
  }

  async findAllContactRequests(): Promise<any[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('contact_requests').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    return mockContactRequests;
  }
}

export const bookingRepository = new BookingRepository();
