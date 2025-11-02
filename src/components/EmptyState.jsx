export default function EmptyState({
  message = 'Nenhum item encontrado',
  description,
  icon: Icon,
  className = '',
}) {
  return (
    <div className={`rounded-lg bg-white shadow ${className}`}>
      <div className="py-8 text-center text-gray-500">
        {Icon && <Icon className="mx-auto mb-4 h-12 w-12 text-gray-400" />}
        <p className="text-base font-medium">{message}</p>
        {description && <p className="mt-2 text-sm text-gray-400">{description}</p>}
      </div>
    </div>
  );
}
