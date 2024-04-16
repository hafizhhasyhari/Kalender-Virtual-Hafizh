import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import useGetUpcomingBookingsQuery from '@/hooks/useGetUpcomingBookingsQuery';

import Button from '../ui/Button';
import FormErrorMessage from '../ui/FormErrorMessage';
import DateRangePicker from './DateRangePicker';

const schema = z
  .object({
    rangeCalendar: z.object(
      {
        start: z.date(),
        end: z.date(),
      },
      { required_error: 'Please select a date range' }
    ),
  })
  .refine(
    ({ rangeCalendar }) => {
      return rangeCalendar.end.getTime() > rangeCalendar.start.getTime();
    },
    {
      message: 'End date must be after start date',
      path: ['rangeCalendar'],
    }
  );

export type FormData = z.infer<typeof schema>;

const BookingForm = ({
  propertyId,
  isLoading,
  bookingId,
  onSubmit,
  onCancel,
}: {
  propertyId: string;
  isLoading: boolean;
  bookingId?: string;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
}) => {
  const { isLoading: isLoadingUpcomingBookings, error } =
    useGetUpcomingBookingsQuery({
      propertyId,
    });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (isLoadingUpcomingBookings) {
    return <p>Loading...</p>;
  }

  if (error instanceof Error) {
    return <p>{error?.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Fixed height to avoid jumping UI when switching between months of 4 to 5 weeks */}
        <div className="h-[380px]">
          <Controller
            name="rangeCalendar"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <DateRangePicker
                  propertyId={propertyId}
                  onChange={field.onChange}
                  excludeBookingId={bookingId}
                />
              );
            }}
          />
        </div>

        <div>
          {errors?.rangeCalendar && (
            <FormErrorMessage>{errors?.rangeCalendar.message}</FormErrorMessage>
          )}
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            loading={isLoading || isSubmitting}
            fullWidth
          >
            {bookingId ? 'Update booking' : 'Book'}
          </Button>
        </div>
        {bookingId && (
          <div>
            <Button
              type="button"
              intent="secondary"
              disabled={isLoading || isSubmitting}
              fullWidth
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default BookingForm;
