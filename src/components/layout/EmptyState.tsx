import React from 'react';

const EmptyState = ({ children }) => {
  return (
    <div className="flex h-24 items-center justify-center rounded-md border border-solid border-gray-300 text-center text-sm text-gray-400">
      {children}
    </div>
  );
};

export default EmptyState;
