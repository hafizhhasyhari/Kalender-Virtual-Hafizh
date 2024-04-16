import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { Database } from '@/lib/database.types';

const useAddBookingMutation = ({ propertyId }: { propertyId: string }) => {
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      startDate,
      endDate,
    }: {
      startDate: Date;
      endDate: Date;
    }) => {
      if (!user?.id) throw new Error('User not logged in');

      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      // 1. Check if dates are available
      const { data: existingBookings, error: existingError } =
        await supabase.rpc('booking_exists', {
          sdate: formattedStartDate,
          edate: formattedEndDate,
          propid: propertyId,
        });

      if (existingError instanceof Error) console.log(existingError.message);

      if (existingBookings && existingBookings.length > 0) {
        window.alert('Selected dates are not available');
      }

      // 2. Get fact table id
      const { data: factTableData, error: factTableError } = await supabase
        .from('fact_table')
        .select('id')
        .eq('property_id', propertyId)
        .eq('profile_id', user.id)
        .single();

      if (factTableError instanceof Error) {
        throw new Error(factTableError.message);
      }

      if (factTableData?.id) {
        // 3. Insert new booking
        const { data, error } = await supabase.from('bookings').insert([
          {
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            fact_table_id: factTableData?.id,
          },
        ]);

        if (error instanceof Error) {
          throw new Error(error.message);
        }

        return data;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', propertyId] });
    },
  });
};

export default useAddBookingMutation;
