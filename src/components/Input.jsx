export default function Input({
  type = 'text',
  placeholder,
  readOnly = false,
  error = false,
  className = '',
  ...props
}) {
  const base =
    'w-full rounded-lg border px-4 py-3 transition focus:ring-2 focus:outline-none';
  const bg = readOnly ? 'bg-gray-100' : 'bg-white';
  const border = error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-blue-500';
  const ro = readOnly ? 'cursor-not-allowed text-gray-600' : '';

  return (
    <input
      type={type}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`${base} ${bg} ${border} ${ro} ${className}`}
      {...props}
    />
  );
}
