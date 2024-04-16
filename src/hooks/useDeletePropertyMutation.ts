import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RoleIdByName } from '@/constants/constants';
import { Database } from '@/lib/database.types';

const useDeletePropertyMutation = ({ propertyId }: { propertyId: string }) => {
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user?.id) throw new Error('User not logged in');

      // check if user is owner
      const { data, error } = await supabase
        .from('fact_table')
        .select()
        .eq('property_id', propertyId)
        .eq('profile_id', user.id)
        .eq('role_id', RoleIdByName.Owner);

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        // get all bookings for property
        const { data: bookingsData, error: getBookingsError } = await supabase
          .from('bookings')
          .select('id, fact_table!inner(id, property_id)')
          .eq('fact_table.property_id', propertyId);

        if (getBookingsError) {
          throw new Error(getBookingsError.message);
        }

        const bookingIds = bookingsData?.map((item) => item.id);

        // delete all bookings for this property
        const { error: deleteBookingsError } = await supabase
          .from('bookings')
          .delete()
          .in('id', bookingIds);

        if (deleteBookingsError) {
          throw new Error(deleteBookingsError.message);
        }

        // delete all fact_table records for this property
        const { error } = await supabase
          .from('fact_table')
          .delete()
          .eq('property_id', propertyId);

        if (error) {
          throw new Error(error.message);
        }

        // delete property
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .delete()
          .eq('id', propertyId);

        if (propertyError) {
          throw new Error(propertyError.message);
        }

        return propertyData;
      }

      throw new Error('User is not owner');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useDeletePropertyMutation;
