import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Database } from '@/lib/database.types';

const useUpdatePropertyMutation = ({ propertyId }: { propertyId: string }) => {
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!user?.id) throw new Error('User not logged in');

      return await supabase
        .from('properties')
        .update({
          name,
        })
        .eq('id', propertyId)
        .throwOnError();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export default useUpdatePropertyMutation;
