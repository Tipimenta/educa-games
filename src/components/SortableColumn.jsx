const SortableColumn = ({
  columnKey,
  label,
  currentSort,
  onSort,
  sortable = true,
  className = '',
  align = 'left',
}) => {
  const isActive = currentSort?.column === columnKey;
  const directionArrow = isActive ? (currentSort?.direction === 'asc' ? '↑' : '↓') : null;

  const handleClick = () => {
    if (!sortable) return;
    onSort && onSort(columnKey);
  };

  const alignClass =
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <th
      onClick={handleClick}
      className={`px-6 py-4 ${alignClass} align-middle text-sm font-semibold tracking-wider text-gray-700 uppercase ${
        sortable ? 'cursor-pointer select-none' : ''
      } ${className}`}
    >
      <span
        className={`inline-flex items-center gap-1 ${
          align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''
        }`}
      >
        {label}
        {sortable && isActive && <span>{directionArrow}</span>}
      </span>
    </th>
  );
};

export default SortableColumn;
