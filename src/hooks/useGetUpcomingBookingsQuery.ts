import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';

const useGetUpcomingBookingsQuery = ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const supabaseClient = useSupabaseClient();

  const fetch = async () => {
    return await supabaseClient
      .from('bookings')
      .select('id, start_date, end_date, fact_table!inner(id)')
      .eq('fact_table.property_id', propertyId)
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .throwOnError();
  };

  return useQuery({
    queryKey: ['bookings', propertyId],
    queryFn: async () => {
      return await fetch().then((result) => result.data);
    },
    enabled: !!propertyId,
  });
};

export default useGetUpcomingBookingsQuery;
