import EmptyState from './EmptyState';
import Pagination from './Pagination';
import SortableColumn from './SortableColumn';

export default function DataTable({
  columns,
  data,
  currentSort,
  onSort,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  emptyMessage = 'Nenhum item encontrado',
  emptySearchMessage = 'Nenhum resultado encontrado',
  hasSearch = false,
  renderRow,
  className = '',
  embedded = false,
}) {
  if (data.length === 0) {
    if (embedded) return null;
    return (
      <EmptyState
        message={hasSearch ? emptySearchMessage : emptyMessage}
        className="mx-auto mt-2 max-w-[95%]"
      />
    );
  }

  const Wrapper = ({ children }) =>
    embedded ? (
      <div className={`overflow-x-auto ${className}`}>{children}</div>
    ) : (
      <div className={`mx-auto mt-2 max-w-[95%] overflow-x-auto rounded-lg bg-white shadow ${className}`}>
        {children}
      </div>
    );

  return (
    <Wrapper>
      <table className="w-full table-auto divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <SortableColumn
                key={column.key}
                columnKey={column.key}
                label={column.label}
                currentSort={currentSort}
                sortable={column.sortable !== false}
                align={column.align || 'left'}
                onSort={onSort}
                className={column.className || ''}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </Wrapper>
  );
}

