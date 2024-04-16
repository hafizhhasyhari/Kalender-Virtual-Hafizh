import { parse, parseISO } from 'date-fns';

export function getMaxAvailableEndDate(startDate: Date, bookings = []) {
  if (!startDate) return null;

  const result = bookings.reduce((acc, booking) => {
    const _isAfter =
      parse(booking.start_date, 'yyyy-MM-dd', new Date()) > startDate;
    const _isBefore = parse(booking.start_date, 'yyyy-MM-dd', new Date()) < acc;

    if (_isAfter && !_isBefore) {
      return parseISO(booking.start_date);
    } else if (_isAfter && _isBefore) {
      return acc;
    }

    return acc;
  }, null);

  return result;
}
