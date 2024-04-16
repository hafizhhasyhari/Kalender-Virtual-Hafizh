import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';

const useGetGuestsQuery = ({ propertyId }: { propertyId: string }) => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  const fetchGuests = async () => {
    return await supabaseClient
      .from('fact_table')
      .select(
        'id, role_id, profiles(id, email, first_name, last_name, last_sign_in_at)'
      )
      .eq('property_id', propertyId)
      // exclude the current user
      .neq('profile_id', user?.id)
      .throwOnError();
  };

  return useQuery<unknown, unknown, unknown>({
    queryKey: ['guests', propertyId],
    queryFn: async () => fetchGuests().then((result) => result.data),
  });
};

export default useGetGuestsQuery;
