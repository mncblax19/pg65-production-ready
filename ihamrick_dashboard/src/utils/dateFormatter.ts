type DateFormatterOptions = {
  locale?: string;
  timeZone?: string;
  showTime?: boolean;
  showSeconds?: boolean;
  unformatted?: boolean;
};

export const dateFormatter = (dateInput: string | Date, options: DateFormatterOptions = {}) => {
  if (!dateInput) return '-';

  const {
    locale = navigator.language,
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    showTime = false,
    showSeconds = false,
    unformatted = false,
  } = options;

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  if (unformatted) {
    // unformatted → yyyy-MM-ddT00:00:00
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00`;
  }

  // formatted → Intl.DateTimeFormat
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone,
  };

  if (showTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    if (showSeconds) formatOptions.second = '2-digit';
    formatOptions.hour12 = true;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
};
