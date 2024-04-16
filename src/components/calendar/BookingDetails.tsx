import React from 'react';

import useDeleteBookingMutation from '@/hooks/useDeleteBookingMutation';
import useUpdateBookingMutation from '@/hooks/useUpdateBookingMutation';

import Button from '../ui/Button';
import Headline from '../ui/Headline';
import { DialogContext } from './../dialog/DialogContext';
import BookingForm from './BookingForm';
import ReadableDates from './ReadableDates';

export default function BookingDetails({
  propertyId,
  bookingId,
  startDate,
  endDate,
}: {
  propertyId: string;
  bookingId: string;
  startDate: Date;
  endDate: Date;
}) {
  const [showForm, setShowForm] = React.useState(false);
  const dialogContext = React.useContext(DialogContext);

  const updateMutation = useUpdateBookingMutation({
    propertyId,
    bookingId,
  });

  const deleteMutation = useDeleteBookingMutation({
    propertyId,
    bookingId,
  });

  return (
    <div>
      {!showForm && (
        <>
          <Headline level={5}>Booking details</Headline>

          <p>
            Date: <ReadableDates startDate={startDate} endDate={endDate} />
          </p>

          <br />

          <div className="flex gap-4">
            <Button
              fullWidth
              intent="primary"
              onClick={() => {
                setShowForm(true);
              }}
            >
              Change dates
            </Button>
            <Button
              fullWidth
              intent="error"
              loading={deleteMutation.isLoading}
              disabled={deleteMutation.isLoading}
              onClick={() => {
                deleteMutation.mutate(undefined, {
                  onSuccess: () => {
                    dialogContext?.setOpen(false);
                  },
                });
              }}
            >
              Delete booking
            </Button>
          </div>
        </>
      )}

      {showForm && (
        <BookingForm
          propertyId={propertyId}
          isLoading={updateMutation.isLoading}
          bookingId={bookingId}
          onSubmit={(formData) => {
            return updateMutation.mutate(
              {
                startDate: formData.rangeCalendar.start,
                endDate: formData.rangeCalendar.end,
              },
              {
                onSuccess: () => {
                  dialogContext?.setOpen(false);
                },
              }
            );
          }}
          onCancel={() => {
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
