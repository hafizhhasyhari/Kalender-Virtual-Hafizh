export function getReadableDates(startDate: Date, endDate: Date) {
  // if same month then don't include name of month twice

  // example
  // same month: 25 - 28 jan.
  // different month: 25 jan. - 3 feb. 2021

  const monthOption =
    startDate.getMonth() !== endDate.getMonth() ? { month: 'short' } : {};

  const readableStartDate = startDate.toLocaleDateString('nl-NL', {
    day: 'numeric',
    ...monthOption,
  });

  const readableEndDate = endDate.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    readableStartDate,
    readableEndDate,
  };
}
