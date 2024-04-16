import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';

const useGetProfileQuery = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  const fetchProfile = async () => {
    const { data, error, status } = await supabaseClient
      .from('profiles')
      .select(`id, first_name, last_name`)
      .eq('id', user?.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  });
};

export default useGetProfileQuery;
