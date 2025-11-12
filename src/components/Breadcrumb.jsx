export default function Breadcrumb({ items = [] }) {
  const displayed = items && items.length > 0 ? items : [{ label: 'Início' }];
  return (
    <nav aria-label="Breadcrumb" className="mb-1 flex items-center text-sm text-gray-400">
      <ol className="flex items-center gap-2">
        {displayed.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
            {item.href ? (
              <a href={item.href} className="hover:text-gray-700">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-700">{item.label}</span>
            )}
            {idx < displayed.length - 1 && <span className="text-gray-300">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}