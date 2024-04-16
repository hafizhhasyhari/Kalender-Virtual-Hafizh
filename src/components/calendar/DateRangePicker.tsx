import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isPast,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useState } from 'react';

import useGetBookingsQuery from '@/hooks/useGetBookingsQuery';
import { getMaxAvailableEndDate } from '@/utils/utils';

import Spinner from '../ui/Spinner';

function DateRangePicker({
  propertyId,
  onChange,
  excludeBookingId,
}: {
  propertyId: string;
  onChange: (dateRange: { start: Date; end: Date }) => void;
  excludeBookingId?: string;
}) {
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), 'MM-yyyy')
  );

  const firstDayCurrentMonth = parse(currentMonth, 'MM-yyyy', new Date());

  let { isLoading, data, error } = useGetBookingsQuery({
    propertyId,
    month: parse(currentMonth, 'MM-yyyy', new Date()).getMonth() + 1,
    year: parse(currentMonth, 'MM-yyyy', new Date()).getFullYear(),
  });

  data = data?.filter((booking) => booking.id !== excludeBookingId);

  if (error instanceof Error) {
    return (
      <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9">
        <p>{error?.message}</p>
      </div>
    );
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayCurrentMonth), {
      locale: undefined,
    }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  const handlePrevMonth = () => {
    let firstDayCurrentMonth = parse(currentMonth, 'MM-yyyy', new Date());
    let firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, 'MM-yyyy'));
  };

  const handleNextMonth = () => {
    let firstDayCurrentMonth = parse(currentMonth, 'MM-yyyy', new Date());
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MM-yyyy'));
  };

  const maxAvailableEndDate =
    startDate && !endDate ? getMaxAvailableEndDate(startDate, data) : null;

  return (
    <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9">
      <div className="flex items-center text-gray-900">
        <button
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={handlePrevMonth}
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="relative flex-auto">
          <div className=" relative inline text-sm font-semibold">
            {format(firstDayCurrentMonth, 'MMMM yyyy')}{' '}
            <div className="absolute -right-7 -top-px">
              {isLoading && <Spinner />}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={handleNextMonth}
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
        {days.map((day, dayIdx) => {
          const isDateUnavailable =
            data?.some((booking) => {
              return (
                parse(booking.start_date, 'yyyy-MM-dd', new Date()) <= day &&
                parse(booking.end_date, 'yyyy-MM-dd', new Date()) >= day
              );
            }) ||
            (maxAvailableEndDate && isAfter(day, maxAvailableEndDate));

          const isTodayDate = isToday(day);
          const isPastDate = isPast(day) && !isTodayDate;
          const isSameMonthDate = isSameMonth(day, firstDayCurrentMonth);
          const isDisabledDate =
            isDateUnavailable || isPastDate || !isSameMonthDate;
          const isSelectedDate =
            (startDate && !endDate && isSameDay(day, startDate)) ||
            (startDate && endDate && day >= startDate && day <= endDate);

          return (
            <button
              key={dayIdx}
              disabled={isDisabledDate}
              onClick={() => {
                if (startDate && endDate) {
                  setStartDate(day);
                  setEndDate(null);
                } else if (startDate && !endDate) {
                  if (day < startDate) {
                    setStartDate(day);
                  } else {
                    setEndDate(day);
                    onChange({
                      start: startDate,
                      end: day,
                    });
                  }
                } else {
                  setStartDate(day);
                }
              }}
              type="button"
              className={classNames(
                'py-2.5',
                !isDisabledDate && 'hover:bg-pink-50',
                isDateUnavailable && 'cursor-not-allowed text-gray-300',
                !isTodayDate &&
                  isPastDate &&
                  'cursor-not-allowed text-gray-300',
                isSameMonthDate ? 'bg-white' : 'bg-gray-50',
                (isSelectedDate || isTodayDate) && 'font-semibold',
                isSelectedDate && 'bg-pink-50 text-pink-700',
                !isSelectedDate &&
                  isSameMonthDate &&
                  !isTodayDate &&
                  'text-gray-900',
                !isSelectedDate &&
                  !isSameMonthDate &&
                  !isTodayDate &&
                  'text-gray-400',
                isTodayDate && !isSelectedDate && 'text-gray-600',

                dayIdx === 0 && 'rounded-tl-lg',
                dayIdx === 6 && 'rounded-tr-lg',
                dayIdx === days.length - 7 && 'rounded-bl-lg',
                dayIdx === days.length - 1 && 'rounded-br-lg'
              )}
            >
              <time
                dateTime={day.toISOString()}
                className={classNames(
                  'mx-auto flex h-7 w-7 items-center justify-center'
                )}
              >
                {isSameMonth(day, firstDayCurrentMonth) ? day.getDate() : ''}
              </time>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DateRangePicker;
