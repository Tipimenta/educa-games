import { formatDate, formatDateWithTimezone } from '../utils/dateFormatter';

export default function FormattedDate({ date, timeZone, className = '' }) {
  const formattedDate = timeZone ? formatDateWithTimezone(date, timeZone) : formatDate(date);

  return <span className={className}>{formattedDate}</span>;
}
