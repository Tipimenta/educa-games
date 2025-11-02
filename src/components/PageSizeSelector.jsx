export default function PageSizeSelector({ value, onChange, options = [5, 10, 20, 50], className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={`custom-select rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
    >
      {options.map((size) => (
        <option key={size} value={size}>
          {size} ITENS
        </option>
      ))}
    </select>
  );
}

