import { format, parse } from 'date-fns';
import { useState } from 'react';

import useGetBookingsQuery from '@/hooks/useGetBookingsQuery';

import ErrorState from '../layout/ErrorState';
import Calendar from './Calendar';

const BookingCalendar = ({
  userId,
  propertyId,
}: {
  userId: string;
  propertyId: string;
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), 'MM-yyyy')
  );

  const { isLoading, data, error, isError } = useGetBookingsQuery({
    propertyId,
    month: parse(currentMonth, 'MM-yyyy', new Date()).getMonth() + 1,
    year: parse(currentMonth, 'MM-yyyy', new Date()).getFullYear(),
  });

  if (isError) {
    console.log(error);
  }

  return (
    <>
      {isError && (
        <ErrorState>
          Fetching bookings failed. Please try again. If the issue persists,
          please reach out to support.
        </ErrorState>
      )}
      <div className="-ml-6 -mr-6">
        <Calendar
          userId={userId}
          propertyId={propertyId}
          setCurrentMonth={setCurrentMonth}
          currentMonth={currentMonth}
          bookings={
            data
              ? data.map((booking) => ({
                  id: booking.id,
                  startDate: booking.start_date,
                  endDate: booking.end_date,
                  profileId: booking.fact_table.profiles.id,
                  firstName: booking.fact_table.profiles.first_name,
                  factTableId: booking.fact_table.id,
                }))
              : []
          }
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default BookingCalendar;
