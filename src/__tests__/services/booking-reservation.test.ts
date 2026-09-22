import { bookingRepository } from '../../../backend/src/repositories/booking.repository';
import { bookingService } from '../../../backend/src/services/booking.service';

describe('Booking & Reservation Architecture', () => {
  const testRoomId = 'room-test-concurrency-01';

  it('should freeze room price and deposit when creating a reservation', async () => {
    const reservation = await bookingRepository.createReservation({
      room_id: testRoomId,
      student_id: 'student-unit-01',
      start_date: '2026-10-01',
      end_date: '2027-06-30',
      monthly_price_dh: 2100,
      deposit_dh: 2100,
      notes: 'Initial test lease',
    });

    expect(reservation).toBeDefined();
    expect(reservation.monthly_price_dh).toBe(2100);
    expect(reservation.deposit_dh).toBe(2100);
    expect(reservation.status).toBe('CONFIRMED');
    expect(reservation.room_id).toBe(testRoomId);
  });

  it('should prevent double booking for overlapping date ranges on the same room', async () => {
    // Attempt to book the exact same room for an overlapping period (Nov 2026 to Dec 2026)
    await expect(
      bookingRepository.createReservation({
        room_id: testRoomId,
        student_id: 'student-unit-02',
        start_date: '2026-11-01',
        end_date: '2026-12-31',
        monthly_price_dh: 2500, // even with higher price
        deposit_dh: 2500,
      })
    ).rejects.toThrow('Cette chambre fait déjà l’objet d’une réservation active pour cette période.');
  });

  it('should reject invalid booking status transitions', async () => {
    await expect(
      bookingService.updateBookingStatus('invalid-id', 'MALICIOUS_STATUS')
    ).rejects.toThrow('Statut invalide');
  });
});
