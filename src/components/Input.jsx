const Input = ({ type = 'text', placeholder, readOnly = false, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    readOnly={readOnly}
    className={`w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none ${
      readOnly ? 'cursor-not-allowed bg-gray-100' : ''
    }`}
    {...props}
  />
);

export default Input;
