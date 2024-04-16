import Button from '@/components/ui/Button';
import useDeleteGuestMutation from '@/hooks/useDeleteGuestMutation';

const GuestListItem = ({
  id,
  propertyId,
  firstName,
  lastName,
  email,
}: {
  id: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  email: string;
}) => {
  const name = firstName || lastName ? `${firstName} ${lastName}` : 'No name';
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-4">
          <div className="truncate whitespace-nowrap font-medium text-gray-700">
            {name}
          </div>
          <div className="truncate text-sm text-gray-400">{email}</div>
        </div>
        <div>
          <DeleteButton propertyId={propertyId} guestId={id}>
            Remove
          </DeleteButton>
        </div>
      </div>
    </div>
  );
};

export default GuestListItem;

function DeleteButton({
  children,
  propertyId,
  guestId,
}: {
  children: React.ReactNode;
  propertyId: string;
  guestId: string;
}) {
  const mutation = useDeleteGuestMutation({ propertyId, guestId });

  return (
    <Button
      intent="error"
      loading={mutation.isLoading}
      disabled={mutation.isLoading}
      onClick={() => {
        mutation.mutate(propertyId);
      }}
    >
      {children}
    </Button>
  );
}
