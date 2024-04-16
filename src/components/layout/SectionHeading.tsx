import React from 'react';

type Props = {
  title: string;
  action?: React.ReactNode;
};

const SectionHeading = ({ title, action }: Props) => {
  return (
    <div className="mb-4 flex items-center">
      <div className="flex-auto">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="ml-4 flex-none sm:mt-0">{action}</div>
    </div>
  );
};

export default SectionHeading;
