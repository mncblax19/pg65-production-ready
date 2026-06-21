export const newDateFormatter = (dateInput: string | Date): string => {
  if (!dateInput) return '-';

  // Convert to string if Date object
  const raw =
    typeof dateInput === 'string'
      ? dateInput
      : dateInput.toISOString();

  // Extract YYYY-MM-DD only
  const [year, month, day] = raw.split('T')[0].split('-');

  // Create date WITHOUT timezone shift
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  );

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
