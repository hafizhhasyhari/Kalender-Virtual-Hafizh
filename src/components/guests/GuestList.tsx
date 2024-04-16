import useGetGuestsQuery from '@/hooks/useGetGuestsQuery';

import Card from '../layout/Card';
import EmptyState from '../layout/EmptyState';
import ErrorState from '../layout/ErrorState';
import LoadingState from '../layout/LoadingState';
import GuestListItem from './GuestListItem';

const GuestList = ({ propertyId }: { propertyId: string }) => {
  const { isLoading, data, error } = useGetGuestsQuery({ propertyId });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error instanceof Error) {
    return <ErrorState>Error: {error.message}</ErrorState>;
  }

  if (data.length === 0) {
    return <EmptyState>No guests have been invited yet</EmptyState>;
  }

  return (
    <Card>
      <div className="divide-y divide-gray-200">
        {data.map((item) => {
          const { id, profiles } = item;

          const { email, first_name, last_name } = profiles;

          return (
            <GuestListItem
              key={id}
              id={id}
              propertyId={propertyId}
              firstName={first_name}
              lastName={last_name}
              email={email}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default GuestList;
