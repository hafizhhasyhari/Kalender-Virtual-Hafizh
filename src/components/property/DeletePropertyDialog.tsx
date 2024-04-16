import { useRouter } from 'next/router';
import { useContext } from 'react';

import useDeletePropertyMutation from '@/hooks/useDeletePropertyMutation';

import Dialog from '../dialog/Dialog';
import { DialogContext } from '../dialog/DialogContext';

const DeletePropertyDialog = ({ propertyId }: { propertyId: string }) => {
  const router = useRouter();
  const dialogContext = useContext(DialogContext);

  const mutation = useDeletePropertyMutation({ propertyId });

  return (
    <Dialog
      title="Are you sure?"
      body="This will permanently delete this property including its bookings. This action cannot be undone. "
      confirmButton={{
        label: 'Yes, delete property',
        loading: mutation.isLoading,
        disabled: mutation.isLoading,
        onClick: () => {
          mutation.mutate(propertyId, {
            onSuccess: () => {
              console.log('redirecting...');
              dialogContext?.setOpen(false);
              router.push('/');
            },
          });
        },
      }}
      cancelButton={{
        label: 'No, keep property',
        onClick: () => {
          dialogContext?.setOpen(false);
        },
      }}
    />
  );
};

export default DeletePropertyDialog;
