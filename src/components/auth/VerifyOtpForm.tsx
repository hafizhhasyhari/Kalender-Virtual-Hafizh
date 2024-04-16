import { zodResolver } from '@hookform/resolvers/zod';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '../ui/Button';
import FormInput from '../ui/FormInput';

interface Props {
  email: string;
  isSignUp: boolean;
  // verifyOtpType: 'magiclink' | 'signup';
}

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().min(6, 'Please enter a valid OTP'),
});

type FormSchema = z.infer<typeof schema>;

const VerifyOtpForm = ({ email, isSignUp }: Props) => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
    },
  });

  const submit = async (formData: FormSchema) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: formData.otp,
        type: isSignUp ? 'signup' : 'magiclink',
      });

      if (error) {
        setError('otp', {
          type: 'manual',
          message: 'Login code is incorrect',
        });

        return;
      }

      router.push('/properties');
    } catch (error: any) {
      setError('otp', {
        type: 'manual',
        message: error.message,
      });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(submit)}>
      <div>
        <FormInput
          label="Email address"
          id="email"
          type="email"
          disabled
          register={register}
          errors={errors}
        />
      </div>

      <div>
        <p className="text-center text-sm text-gray-600">
          {isSignUp ? (
            <>
              We just sent you a temporary sign up code. <br />
              Please check your inbox and paste the sign up code below.
            </>
          ) : (
            <>
              We just sent you a temporary login code.
              <br />
              Please check your inbox.
            </>
          )}
        </p>
      </div>

      <div>
        <FormInput
          label={isSignUp ? 'Sign up code' : 'Login code'}
          id="otp"
          type="text"
          placeholder="Paste the code from your email"
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
          {isSignUp ? 'Create new account' : 'Continue with login code'}
        </Button>
      </div>
    </form>
  );
};

export default VerifyOtpForm;
