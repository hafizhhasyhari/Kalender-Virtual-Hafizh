import React from 'react';

const ErrorState = ({ children }) => {
  return (
    <div className="flex h-24 items-center justify-center rounded-md border border-solid border-red-300 p-2 text-center text-sm  text-red-500">
      {children}
    </div>
  );
};

export default ErrorState;
