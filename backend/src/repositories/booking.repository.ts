import { BookingFormValues } from '../shared/schemas/booking.schema';
import { LandlordFormValues } from '../shared/schemas/landlord.schema';
import { ContactFormValues } from '../shared/schemas/contact.schema';
import { getSupabaseAdmin } from '../config/supabase';
import {
  DbBookingRequest,
  DbLandlordSubmission,
  DbContactRequest,
  BookingStatus,
  DbReservation,
} from '../shared/types/database';
import { AppError } from '../lib/response';

// Mock in-memory storage for reservations
const mockReservations: DbReservation[] = [
  {
    id: 'res-mock-001',
    room_id: 'room-1-2',
    student_id: 'student-demo-01',
    start_date: '2026-09-01',
    end_date: '2027-06-30',
    monthly_price_dh: 2300,
    deposit_dh: 2300,
    status: 'CONFIRMED',
    notes: 'Contrat étudiant régulier',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];


// In-memory fallbacks for development / demo
const mockBookings: any[] = [
  {
    id: 'SR-BOOK-482910',
    student_name: 'Karim El Amrani',
    student_email: 'karim.amrani@gmail.com',
    student_phone: '+212 634 536 286',
    university_name: 'FSAN Nador (Faculté des Sciences Appliquées)',
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

  async updateContactRequestStatus(id: string, status: string): Promise<any> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_requests')
        .update({ status, read_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const item = mockContactRequests.find((c) => c.id === id);
    if (item) {
      item.status = status;
      return item;
    }
    return null;
  }


  // ─── Reservations (Official Leases) ──────────────────────────────────────────

  async createReservation(payload: {
    room_id: string;
    student_id: string;
    booking_request_id?: string;
    start_date: string;
    end_date?: string;
    monthly_price_dh: number;
    deposit_dh: number;
    notes?: string;
  }): Promise<DbReservation> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      try {
        const dbPayload = {
          room_id: payload.room_id,
          student_id: payload.student_id,
          booking_request_id: payload.booking_request_id || null,
          start_date: payload.start_date,
          end_date: payload.end_date || null,
          monthly_price_dh: payload.monthly_price_dh,
          deposit_dh: payload.deposit_dh,
          status: 'CONFIRMED',
          notes: payload.notes || null,
        };

        const { data, error } = await supabase
          .from('reservations')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          // Handle PostgreSQL 23P01 exclusion violation (double booking)
          if (
            error.code === '23P01' ||
            error.message?.includes('no_overlapping_active_reservations')
          ) {
            throw new AppError(
              409,
              'DOUBLE_BOOKING_CONFLICT',
              'Cette chambre fait déjà l’objet d’une réservation active pour cette période.'
            );
          }
          console.error('[SUPABASE ERROR] createReservation failed:', error.message);
        } else if (data) {
          return data as DbReservation;
        }
      } catch (err: any) {
        if (err instanceof AppError) throw err;
        // Network / environment fallback (unit tests / offline dev)
      }
    }


    // In-memory fallback with concurrency check
    const start = new Date(payload.start_date).getTime();
    const end = payload.end_date ? new Date(payload.end_date).getTime() : Infinity;

    const hasOverlap = mockReservations.some((res) => {
      if (res.room_id !== payload.room_id) return false;
      if (res.status !== 'CONFIRMED' && res.status !== 'ACTIVE') return false;

      const resStart = new Date(res.start_date).getTime();
      const resEnd = res.end_date ? new Date(res.end_date).getTime() : Infinity;

      // Overlap condition: start <= resEnd && end >= resStart
      return start <= resEnd && end >= resStart;
    });

    if (hasOverlap) {
      throw new AppError(
        409,
        'DOUBLE_BOOKING_CONFLICT',
        'Cette chambre fait déjà l’objet d’une réservation active pour cette période.'
      );
    }

    const newReservation: DbReservation = {
      id: 'res-' + Math.floor(100000 + Math.random() * 900000),
      room_id: payload.room_id,
      student_id: payload.student_id,
      booking_request_id: payload.booking_request_id,
      start_date: payload.start_date,
      end_date: payload.end_date,
      monthly_price_dh: payload.monthly_price_dh,
      deposit_dh: payload.deposit_dh,
      status: 'CONFIRMED',
      notes: payload.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockReservations.unshift(newReservation);
    return newReservation;
  }

  async findAllReservations(): Promise<DbReservation[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, room:rooms(*, property:properties(title, neighborhood, city_id)), student:students(*)')
        .order('created_at', { ascending: false });

      if (!error && data) return data as unknown as DbReservation[];
    }
    return mockReservations;
  }

  async findReservationsByStudent(studentId: string): Promise<DbReservation[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, room:rooms(*, property:properties(title, neighborhood, city_id))')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (!error && data) return data as unknown as DbReservation[];
    }
    return mockReservations.filter((r) => r.student_id === studentId);
  }

  async findReservationsByRoom(roomId: string): Promise<DbReservation[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false });

      if (!error && data) return data as DbReservation[];
    }
    return mockReservations.filter((r) => r.room_id === roomId);
  }
}

export const bookingRepository = new BookingRepository();

