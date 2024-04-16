import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import useAddGuestMutation from '@/hooks/useAddGuestMutation';

import Button from '../ui/Button';
import FormInput from '../ui/FormInput';

const schema = z.object({
  firstName: z.string().min(2, 'Please enter a valid first name'),
  lastName: z.string().min(2, 'Please enter a valid last name'),
  email: z.string().email('Please enter a valid email address'),
});

export type FormSchema = z.infer<typeof schema>;

const InviteGuestForm = ({
  propertyId,
  onSuccess,
}: {
  propertyId: string;
  onSuccess: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const mutation = useAddGuestMutation({ propertyId });

  const onSubmit = async (formData: FormSchema) => {
    mutation.mutate(formData, {
      onSuccess,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <FormInput
          label="First name"
          id="firstName"
          register={register}
          errors={errors}
        />
      </div>
      <div>
        <FormInput
          label="Last name"
          id="lastName"
          register={register}
          errors={errors}
        />
      </div>
      <div>
        <FormInput
          label="Email address"
          id="email"
          type="email"
          register={register}
          errors={errors}
        />
      </div>

      <div>
        <Button
          fullWidth
          type="submit"
          disabled={mutation.isLoading || isSubmitting}
          loading={mutation.isLoading || isSubmitting}
        >
          Invite guest
        </Button>
      </div>
    </form>
  );
};

export default InviteGuestForm;
