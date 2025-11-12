import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  message = 'Nenhum item encontrado',
  description,
  icon: Icon = PackageOpen,
  action,
  className = '',
  variant = 'card',
}) {
  const containerClasses =
    variant === 'inline'
      ? 'text-center px-6 py-8'
      : 'mx-auto max-w-2xl rounded-lg bg-white px-12 py-14 text-center shadow';

  return (
    <div className={`${containerClasses} ${className}`}>
      <Icon className="mx-auto mb-4 h-20 w-20 text-[#fe8c68]" strokeWidth={1.5} />
      <h2 className="mb-1 text-lg font-semibold text-gray-700">{message}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
