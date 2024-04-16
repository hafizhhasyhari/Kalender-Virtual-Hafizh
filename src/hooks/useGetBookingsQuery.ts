import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const useGetBookingsQuery = ({
  month,
  year,
  propertyId,
}: {
  month: number;
  year: number;
  propertyId: string;
}) => {
  const supabaseClient = useSupabaseClient();

  const fetchBookings = async () => {
    const daysInMonth = new Date(year, month, 0).getDate();

    const startDate = format(new Date(year, month, 1), 'yyyy-MM-dd');
    const endDate = format(
      new Date(year, month - 1, daysInMonth),
      'yyyy-MM-dd'
    );

    const query = supabaseClient
      .from('bookings')
      .select(
        'id, start_date, end_date, fact_table!inner(id, profile_id, profiles(id, first_name, last_name), properties(id, name))'
      )
      .eq('fact_table.property_id', propertyId)
      // start date is within range
      .or(`start_date.gte.${startDate},and(start_date.lte.${endDate})`)
      // end date is within range
      .or(`end_date.gte.${startDate},and(end_date.lte.${endDate})`)
      // start date is before range and end date is after range
      .or(`start_date.lt.${startDate},and(end_date.gt.${endDate})`)
      .order('start_date', { ascending: true })
      .throwOnError();

    return await query;
  };

  return useQuery({
    queryKey: ['bookings', propertyId, `${month}-${year}`],
    queryFn: async () => {
      return await fetchBookings().then((result) => result.data);
    },
  });
};
export default useGetBookingsQuery;
