export default function Label({ htmlFor, children, required = false, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`mb-2 block text-sm font-bold text-gray-700 ${className}`}>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}
