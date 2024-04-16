import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isPast,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { Dispatch, SetStateAction, useContext } from 'react';

import useAddBookingMutation from '@/hooks/useAddBookingMutation';

import { DialogContext } from '../dialog/DialogContext';
import FloatingActionButton from '../ui/FloatingActionButton';
import Spinner from '../ui/Spinner';
import BookingDetails from './BookingDetails';
import BookingForm from './BookingForm';
import CalendarEvent from './CalendarEvent';

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  firstName: string;
  factTableId: string;
  profileId: string;
};

function Calendar({
  userId,
  propertyId,
  currentMonth,
  setCurrentMonth,
  bookings = [],
  isLoading,
}: {
  userId: string;
  propertyId: string;
  setCurrentMonth: Dispatch<SetStateAction<string>>;
  currentMonth: string;
  bookings: Booking[];
  isLoading: boolean;
}) {
  const dialogContext = useContext(DialogContext);
  const firstDayCurrentMonth = parse(currentMonth, 'MM-yyyy', new Date());

  const mutation = useAddBookingMutation({
    propertyId,
  });

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayCurrentMonth)),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  // Create an array of weeks
  const weeks = createArrayOfWeeks(days);

  const handlePrevMonth = () => {
    const firstDayCurrentMonth = parse(currentMonth, 'MM-yyyy', new Date());
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, 'MM-yyyy'));
  };

  const handleNextMonth = () => {
    const firstDayCurrentMonth = parse(currentMonth, 'MM-yyyy', new Date());
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MM-yyyy'));
  };

  const handleReset = () => {
    setCurrentMonth(format(new Date(), 'MM-yyyy'));
  };

  const handleNewBookingClick = () => {
    dialogContext?.setDialog(
      <BookingForm
        propertyId={propertyId}
        isLoading={mutation.isLoading}
        onSubmit={(formData) => {
          mutation.mutate(
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
      />
    );
    dialogContext?.setOpen(true);
  };

  const handleExistingBookingClick = ({
    propertyId,
    bookingId,
    startDate,
    endDate,
  }: {
    propertyId: string;
    bookingId: string;
    startDate: Date;
    endDate: Date;
  }) => {
    dialogContext?.setDialog(
      <BookingDetails
        propertyId={propertyId}
        bookingId={bookingId}
        startDate={startDate}
        endDate={endDate}
      />
    );
    dialogContext?.setOpen(true);
  };

  return (
    <div>
      <header className="flex items-center justify-between border-b border-gray-200 px-6 pb-4 lg:flex-none">
        <div className="flex items-center">
          <h1 className="whitespace-nowrap text-lg font-semibold leading-6 text-gray-900 lg:text-xl">
            {format(firstDayCurrentMonth, 'MMMM yyyy')}
          </h1>
          <div className="ml-4">{isLoading && <Spinner />}</div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
              onClick={handlePrevMonth}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
              onClick={handleReset}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
              onClick={handleNextMonth}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="ml-6 hidden h-6 w-px bg-gray-300 sm:block" />
          <button
            type="button"
            className="ml-6 hidden rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:block"
            onClick={handleNewBookingClick}
          >
            New booking
          </button>
          <div className="sm:hidden">
            <FloatingActionButton onClick={handleNewBookingClick} />
          </div>
        </div>
      </header>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
        </div>

        <div className="bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          {weeks.map((week, index) => {
            return (
              <div
                key={index}
                className="relative flex border-b border-solid border-b-gray-200"
              >
                <div className="absolute z-10 w-full pt-8">
                  <div className="grid grid-cols-7">
                    {bookings.map((booking, index) => {
                      const bookingStartDate = parse(
                        booking.startDate,
                        'yyyy-MM-dd',
                        new Date()
                      );

                      const bookingEndDate = parse(
                        booking.endDate,
                        'yyyy-MM-dd',
                        new Date()
                      );

                      const dateOverlap = checkDateOverlap({
                        bookingStartDate,
                        bookingEndDate,
                        calendarStartDate: week[0],
                        calendarEndDate: week[6],
                      });

                      if (!dateOverlap) return null;

                      const startColumn =
                        bookingStartDate < week[0]
                          ? 1
                          : bookingStartDate.getDay() + 1;

                      const endColumn =
                        bookingEndDate > week[6]
                          ? 8
                          : Math.min(bookingEndDate.getDay() + 2, 8);

                      return (
                        <div
                          key={booking.id}
                          className={classNames({
                            'col-start-1': startColumn === 1,
                            'col-start-2': startColumn === 2,
                            'col-start-3': startColumn === 3,
                            'col-start-4': startColumn === 4,
                            'col-start-5': startColumn === 5,
                            'col-start-6': startColumn === 6,
                            'col-start-7': startColumn === 7,
                            'col-end-2': endColumn === 2,
                            'col-end-3': endColumn === 3,
                            'col-end-4': endColumn === 4,
                            'col-end-5': endColumn === 5,
                            'col-end-6': endColumn === 6,
                            'col-end-7': endColumn === 7,
                            'col-end-8': endColumn === 8,
                          })}
                        >
                          <div className="mx-0.5">
                            <CalendarEvent
                              title={booking.firstName}
                              isPast={isPast(bookingEndDate)}
                              onClick={() => {
                                handleExistingBookingClick({
                                  propertyId: propertyId,
                                  bookingId: booking.id,
                                  startDate: bookingStartDate,
                                  endDate: bookingEndDate,
                                });
                              }}
                              disabled={userId !== booking.profileId}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {week.map((date, index) => {
                  return (
                    <div
                      key={index}
                      className={classNames(
                        'h-20 flex-1  border-r-gray-200 bg-white py-1 px-2',
                        {
                          'border-r': index !== 6,
                        }
                      )}
                    >
                      <time
                        dateTime={date.toISOString().split('T')[0]}
                        className={classNames(
                          isPast(date) && !isToday(date) && 'text-gray-300',
                          !isPast(date) &&
                            !isToday(date) &&
                            isSameMonth(date, firstDayCurrentMonth) &&
                            'text-gray-800',
                          !isPast(date) &&
                            !isToday(date) &&
                            !isSameMonth(date, firstDayCurrentMonth) &&
                            'text-gray-300',
                          isToday(date) &&
                            isSameMonth(date, firstDayCurrentMonth) &&
                            '-ml-1 rounded-md bg-gray-700 px-2 py-1 font-semibold text-white'
                        )}
                      >
                        {isSameMonth(date, firstDayCurrentMonth)
                          ? date.getDate()
                          : ''}
                      </time>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;

function checkDateOverlap({
  bookingStartDate,
  bookingEndDate,
  calendarStartDate,
  calendarEndDate,
}: {
  bookingStartDate: Date;
  bookingEndDate: Date;
  calendarStartDate: Date;
  calendarEndDate: Date;
}) {
  // Check if the start date of the event is after the end date of the calendar or
  // if the end date of the event is before the start date of the calendar
  if (
    bookingStartDate > calendarEndDate ||
    bookingEndDate < calendarStartDate
  ) {
    return false; // No overlap
  }
  return true; // Overlap
}

function createArrayOfWeeks(days: Date[]) {
  return Array(Math.ceil(days.length / 7))
    .fill(0)
    .map((_, index) => days.slice(index * 7, index * 7 + 7));
}
