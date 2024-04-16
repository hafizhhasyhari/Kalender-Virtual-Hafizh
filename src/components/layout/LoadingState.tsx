import React from 'react';

import Spinner from '../ui/Spinner';

const LoadingState = () => {
  return (
    <div className="flex h-24 items-center justify-center rounded-md border border-solid border-gray-200 text-center text-sm">
      <Spinner />
    </div>
  );
};

export default LoadingState;
