import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import useAddPropertyMutation from '@/hooks/useAddPropertyMutation';

const schema = z.object({
  name: z.string().min(3, 'Please enter a valid name'),
});

export type FormSchema = z.infer<typeof schema>;

const PropertyForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const addPropertyMutation = useAddPropertyMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (formData: FormSchema) => {
    addPropertyMutation.mutate(
      {
        name: formData.name,
      },
      {
        onSuccess,
      }
    );
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <FormInput label="Name" id="name" register={register} errors={errors} />
      </div>
      <div>
        <Button
          type="submit"
          fullWidth
          disabled={addPropertyMutation.isLoading || isSubmitting}
          loading={addPropertyMutation.isLoading || isSubmitting}
        >
          Add
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
