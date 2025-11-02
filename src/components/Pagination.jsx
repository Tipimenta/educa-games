const PageButton = ({ children, onClick, disabled = false, active = false }) => {
  const base = 'px-3 py-2 min-h-[32px] border border-gray-300 rounded-md text-sm transition-colors';
  const state = disabled
    ? 'opacity-50 cursor-not-allowed'
    : active
      ? 'bg-blue-600 text-white font-medium border-blue-600 hover:bg-blue-700'
      : 'hover:bg-gray-50 text-gray-700';
  return (
    <button className={`${base} ${state}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const buildPageRange = (totalPages, currentPage) => {
  // Large layout: show first, last, current +/-1 with ellipses when needed
  const pages = new Set([1, totalPages, currentPage]);
  if (currentPage - 1 >= 1) pages.add(currentPage - 1);
  if (currentPage + 1 <= totalPages) pages.add(currentPage + 1);
  const list = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < list.length; i++) {
    result.push(list[i]);
    if (i < list.length - 1 && list[i + 1] - list[i] > 1) {
      result.push('...');
    }
  }
  return result;
};

export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const goPrev = () => onPageChange(Math.max(1, currentPage - 1));
  const goNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  const pagesLg = buildPageRange(totalPages, currentPage);

  return (
    <div className="mt-1 border-t border-gray-200 px-3 py-1">
      {/* Large screens: full controls aligned right */}
      <div className="hidden w-full items-center justify-end gap-2 lg:flex">
        <div className="mr-auto text-sm text-gray-700">
          Mostrando {from}–{to} de {totalItems} registros
        </div>
        <PageButton onClick={goPrev} disabled={currentPage === 1}>
          Anterior
        </PageButton>
        {pagesLg.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-lg-${idx}`} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <PageButton
              key={`page-lg-${p}`}
              onClick={() => onPageChange(p)}
              active={p === currentPage}
            >
              {p}
            </PageButton>
          )
        )}
        <PageButton onClick={goNext} disabled={currentPage === totalPages}>
          Próximo
        </PageButton>
      </div>

      {/* Medium screens: fewer numbers, centered */}
      <div className="hidden w-full items-center justify-center gap-2 sm:flex lg:hidden">
        <PageButton onClick={goPrev} disabled={currentPage === 1}>
          Anterior
        </PageButton>
        {/* Show 1, current, last with ellipses when needed */}
        <PageButton onClick={() => onPageChange(1)} active={currentPage === 1}>
          1
        </PageButton>
        {currentPage > 2 && <span className="px-2 text-gray-500">...</span>}
        {currentPage !== 1 && currentPage !== totalPages && (
          <PageButton onClick={() => onPageChange(currentPage)} active>
            {currentPage}
          </PageButton>
        )}
        {currentPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
        {totalPages > 1 && (
          <PageButton onClick={() => onPageChange(totalPages)} active={currentPage === totalPages}>
            {totalPages}
          </PageButton>
        )}
        <PageButton onClick={goNext} disabled={currentPage === totalPages}>
          Próximo
        </PageButton>
      </div>

      {/* Small screens: show only arrows and summary */}
      <div className="flex w-full items-center justify-center gap-3 text-sm sm:hidden">
        <PageButton onClick={goPrev} disabled={currentPage === 1}>
          &lt;
        </PageButton>
        <span className="text-gray-700">
          {currentPage} de {totalPages}
        </span>
        <PageButton onClick={goNext} disabled={currentPage === totalPages}>
          &gt;
        </PageButton>
      </div>
    </div>
  );
}
