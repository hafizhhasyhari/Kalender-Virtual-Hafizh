import React from 'react';

import FormErrorMessage from './FormErrorMessage';
import FormLabel from './FormLabel';

interface Props extends React.ComponentPropsWithoutRef<'textarea'> {
  label: string;
  id: string;
  register: any;
  errors: any;
}

const FormTextArea = ({ label, id, register, errors, ...rest }: Props) => {
  return (
    <div>
      <FormLabel id={id}>{label}</FormLabel>
      <div className="mt-1">
        <textarea
          id={id}
          name={id}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
          {...rest}
          {...register(id)}
        />
      </div>
      {errors[id] && <FormErrorMessage>{errors[id].message}</FormErrorMessage>}
    </div>
  );
};

export default FormTextArea;
