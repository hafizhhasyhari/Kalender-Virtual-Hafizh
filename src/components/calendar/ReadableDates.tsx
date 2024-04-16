import { format } from 'date-fns';

import { getReadableDates } from '@/lib/date';

const ReadableDates = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const dates = getReadableDates(startDate, endDate);

  return (
    <>
      <time dateTime={format(startDate, 'yyyy-MM-dd')}>
        {dates.readableStartDate}
      </time>
      {' - '}
      <time dateTime={format(endDate, 'yyyy-MM-dd')}>
        {dates.readableEndDate}
      </time>
    </>
  );
};

export default ReadableDates;
