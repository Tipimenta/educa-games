import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Pesquisar...', className = '' }) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}

