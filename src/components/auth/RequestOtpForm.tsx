import { zodResolver } from '@hookform/resolvers/zod';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '../ui/Button';
import FormInput from '../ui/FormInput';

interface Props {
  onSubmitSuccess: (email: string) => void;
  isSignUp: boolean;
}

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormSchema = z.infer<typeof schema>;

const RequestOtpForm = ({ onSubmitSuccess, isSignUp }: Props) => {
  const supabase = useSupabaseClient();

  const {
    register,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: FormSchema) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: isSignUp ? 'http://localhost:3000/login' : undefined,
          shouldCreateUser: isSignUp,
        },
      });
      if (error) {
        setError('email', {
          type: 'manual',
          message:
            'You can only request a login code once every 60 seconds. Please try again in minute.',
        });

        return;
      }

      onSubmitSuccess(formData.email);
    } catch (error: any) {
      if (error.status === 400) {
        // show success message despite error
        // to avoid leaking user emails
        onSubmitSuccess(formData.email);
      } else {
        console.log({ error });
      }
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          fullWidth
        >
          Continue with email
        </Button>
      </div>
    </form>
  );
};

export default RequestOtpForm;
