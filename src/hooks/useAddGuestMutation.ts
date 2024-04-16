import { useMutation, useQueryClient } from '@tanstack/react-query';

const useAddGuestMutation = ({ propertyId }: { propertyId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: { email: string }) => {
      try {
        const result = await fetch('/api/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            propertyId: propertyId,
          }),
        });

        const body = await result.json();

        if (result.status === 409) {
          throw new Error(body.message);
          // console.log('body.message', body.message);
          //   setError('singleErrorInput', {
          //     type: 'custom',
          //     message: body.error,
          //   });
        }

        return body;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['guests', propertyId]);
    },
  });
};

export default useAddGuestMutation;
