import Link from 'next/link';
import React from 'react';

import Headline from './ui/Headline';

export default function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <Headline level={3}>{title}</Headline>
        </div>

        <div className="ml-4 mt-2 flex-shrink-0">
          {action && (
            <Link href={action.href}>
              <button
                type="button"
                className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {action.label}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
