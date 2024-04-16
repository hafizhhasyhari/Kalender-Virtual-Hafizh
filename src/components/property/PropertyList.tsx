import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

import { RoleIdByName } from '@/constants/constants';
import useGetPropertiesQuery from '@/hooks/useGetPropertiesQuery';

import Card from '../layout/Card';
import EmptyState from '../layout/EmptyState';
import ErrorState from '../layout/ErrorState';
import LoadingState from '../layout/LoadingState';

const PropertyList = () => {
  const { isLoading, data, error } = useGetPropertiesQuery();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error instanceof Error) {
    return <ErrorState>Error: {error?.message}</ErrorState>;
  }

  if (!data || data.length === 0) {
    return <EmptyState>No properties listed</EmptyState>;
  }

  return (
    <Card>
      <ul role="list" className="divide-y divide-gray-200">
        {data.map((item) => {
          const { id, name, fact_table } = item;

          return (
            <li key={id}>
              <Link
                href={`/properties/${id}/calendar`}
                className="block hover:bg-gray-50"
              >
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex min-w-0 flex-1 items-center">
                    <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="truncate text-sm font-medium text-indigo-600">
                          {name}
                        </p>
                      </div>

                      <div className="">
                        <div>
                          <p className="text-sm text-gray-900">
                            {fact_table.role_id === RoleIdByName.Owner
                              ? 'Owner'
                              : 'Guest'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ChevronRightIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default PropertyList;
