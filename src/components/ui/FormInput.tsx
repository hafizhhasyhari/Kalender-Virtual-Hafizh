import React from 'react';

import FormErrorMessage from './FormErrorMessage';
import FormLabel from './FormLabel';

interface Props extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
  id: string;
  register: any;
  type?: string;
  errors: any;
}

const FormInput = ({
  label,
  id,
  register,
  errors,
  type = 'text',
  ...rest
}: Props) => {
  return (
    <div>
      <FormLabel id={id}>{label}</FormLabel>
      <div className="mt-1">
        <input
          id={id}
          name={id}
          type={type}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
          {...rest}
          {...register(id)}
        />
      </div>
      {errors[id] && <FormErrorMessage>{errors[id].message}</FormErrorMessage>}
    </div>
  );
};

export default FormInput;
