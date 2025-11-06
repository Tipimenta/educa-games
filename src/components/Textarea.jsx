export default function Textarea({
  placeholder,
  readOnly = false,
  error = false,
  className = '',
  rows = 4,
  ...props
}) {
  const base =
    'w-full rounded-lg border bg-white px-4 py-3 transition focus:ring-2 focus:outline-none resize-vertical';
  const border = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-blue-500';
  const ro = readOnly ? 'cursor-not-allowed bg-gray-100' : '';

  return (
    <textarea
      placeholder={placeholder}
      readOnly={readOnly}
      rows={rows}
      className={`${base} ${border} ${ro} ${className}`}
      {...props}
    />
  );
}
