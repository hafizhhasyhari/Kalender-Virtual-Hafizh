import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useMutation } from '@tanstack/react-query';

const useUpdateProfileMutation = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  return useMutation({
    mutationFn: async (formData: { first_name: string; last_name: string }) => {
      const { data, error } = await supabaseClient
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export default useUpdateProfileMutation;
