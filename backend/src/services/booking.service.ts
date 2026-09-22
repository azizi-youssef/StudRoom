import { bookingRepository } from '../repositories/booking.repository';
import { propertyRepository } from '../repositories/property.repository';
import { bookingFormSchema, BookingFormValues } from '../shared/schemas/booking.schema';
import { landlordFormSchema, LandlordFormValues } from '../shared/schemas/landlord.schema';
import { contactFormSchema, ContactFormValues } from '../shared/schemas/contact.schema';
import { AppError } from '../lib/response';
import {
  DbBookingRequest,
  DbLandlordSubmission,
  DbContactRequest,
  BookingStatus,
  DbReservation,
} from '../shared/types/database';

// Valid booking status transitions
const VALID_BOOKING_STATUSES: BookingStatus[] = [
  'PENDING', 'CONTACTED', 'VISIT_SCHEDULED', 'APPROVED', 'REJECTED', 'CANCELLED',
];

const VALID_LANDLORD_STATUSES = ['new', 'contacted', 'approved', 'declined'] as const;
type LandlordStatus = typeof VALID_LANDLORD_STATUSES[number];

export class BookingService {
  /**
   * Process a new booking request with full server-side validation:
   * 1. Validate payload schema (Zod)
   * 2. Check room exists
   * 3. Check room is AVAILABLE
   * 4. Save to DB
   */
  async processBooking(rawPayload: unknown): Promise<{ bookingId: string; data: DbBookingRequest }> {
    const validatedData: BookingFormValues = bookingFormSchema.parse(rawPayload);

    // Server-side room availability check — never trust the frontend
    if (validatedData.roomId) {
      const room = await propertyRepository.findRoomById(validatedData.roomId);
      if (!room) {
        throw new AppError(404, 'NOT_FOUND', 'La chambre demandée est introuvable.');
      }
      if (room.status !== 'AVAILABLE') {
        throw new AppError(
          409,
          'ROOM_NOT_AVAILABLE',
          "Cette chambre n'est plus disponible à la réservation."
        );
      }
    }

    const bookingId = 'SR-BOOK-' + crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
    const result = await bookingRepository.saveBooking(validatedData, bookingId);
    return { bookingId, data: result };
  }

  async getAllBookings(): Promise<DbBookingRequest[]> {
    return bookingRepository.findAllBookings();
  }

  /**
   * Update booking status with strict validation.
   * Only allows transitions to valid BookingStatus values.
   * When approved, atomically creates an official reservation with frozen room prices.
   */
  async updateBookingStatus(id: string, status: string): Promise<DbBookingRequest> {
    if (!VALID_BOOKING_STATUSES.includes(status as BookingStatus)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        `Statut invalide : "${status}". Valeurs acceptées : ${VALID_BOOKING_STATUSES.join(', ')}.`
      );
    }

    // On APPROVAL: verify room, freeze prices, and generate official reservation
    if (status === 'APPROVED') {
      const all = await bookingRepository.findAllBookings();
      const current = all.find((b) => b.id === id);
      if (!current) {
        throw new AppError(404, 'NOT_FOUND', 'Demande de réservation introuvable.');
      }

      if (current.room_id) {
        const room = await propertyRepository.findRoomById(current.room_id);
        if (!room) {
          throw new AppError(404, 'NOT_FOUND', 'Chambre associée introuvable.');
        }

        // Calculate lease dates
        const startDate = current.preferred_move_in_date || new Date().toISOString().split('T')[0];
        const moveIn = new Date(startDate);
        const durationMonths = current.preferred_duration_months || 10;
        const endDateObj = new Date(moveIn);
        endDateObj.setMonth(endDateObj.getMonth() + durationMonths);
        const endDate = endDateObj.toISOString().split('T')[0];

        const studentId = current.student_id || 'student-auto-' + current.id;

        // Atomically create the official reservation record with frozen prices
        // (will throw 409 DOUBLE_BOOKING_CONFLICT if room is already booked for these dates)
        await bookingRepository.createReservation({
          room_id: current.room_id,
          student_id: studentId,
          booking_request_id: current.id,
          start_date: startDate,
          end_date: endDate,
          monthly_price_dh: room.price_monthly,
          deposit_dh: room.deposit_dh,
          notes: `Validé depuis la demande ${current.id} (${current.student_name})`,
        });

        // Transition room status to RESERVED
        await propertyRepository.updateRoomStatus(current.room_id, 'RESERVED');
      }
    }

    const updated = await bookingRepository.updateBookingStatus(id, status as BookingStatus);
    if (!updated) {
      throw new AppError(404, 'NOT_FOUND', 'Demande de réservation introuvable.');
    }
    return updated;
  }

  async getAllReservations(): Promise<DbReservation[]> {
    return bookingRepository.findAllReservations();
  }

  async getStudentReservations(studentId: string): Promise<DbReservation[]> {
    return bookingRepository.findReservationsByStudent(studentId);
  }


  async processLandlordSubmission(
    rawPayload: unknown
  ): Promise<{ proposalId: string; data: DbLandlordSubmission }> {
    const validatedData: LandlordFormValues = landlordFormSchema.parse(rawPayload);
    const proposalId = 'SR-PROP-' + crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
    const result = await bookingRepository.saveLandlordSubmission(validatedData, proposalId);
    return { proposalId, data: result };
  }

  async getAllLandlordSubmissions(): Promise<DbLandlordSubmission[]> {
    return bookingRepository.findAllLandlordSubmissions();
  }

  async updateLandlordSubmissionStatus(id: string, status: string): Promise<DbLandlordSubmission> {
    if (!VALID_LANDLORD_STATUSES.includes(status as LandlordStatus)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        `Statut invalide : "${status}". Valeurs acceptées : ${VALID_LANDLORD_STATUSES.join(', ')}.`
      );
    }

    const updated = await bookingRepository.updateLandlordSubmissionStatus(id, status);
    if (!updated) {
      throw new AppError(404, 'NOT_FOUND', 'Proposition de logement introuvable.');
    }
    return updated;
  }

  async processContactRequest(
    rawPayload: unknown
  ): Promise<{ ticketId: string; data: DbContactRequest }> {
    const validatedData: ContactFormValues = contactFormSchema.parse(rawPayload);
    const ticketId = 'SR-TKT-' + crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
    const result = await bookingRepository.saveContactRequest(validatedData, ticketId);
    return { ticketId, data: result };
  }

  async getAllContactRequests(): Promise<DbContactRequest[]> {
    return bookingRepository.findAllContactRequests();
  }
}

export const bookingService = new BookingService();
