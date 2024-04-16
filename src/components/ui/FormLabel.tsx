import React from 'react';

interface Props {
  id: string;
  children: React.ReactNode;
}

const FormLabel = ({ id, children }: Props) => {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};

export default FormLabel;
