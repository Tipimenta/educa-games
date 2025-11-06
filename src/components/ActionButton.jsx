export default function ActionButton({
  icon: Icon,
  onClick,
  title,
  variant = 'default',
  className = '',
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
      case 'delete':
        return 'text-red-600 hover:bg-gray-100 hover:text-red-900';
      case 'success':
      case 'activate':
        return 'text-green-600 hover:bg-gray-100 hover:text-green-900';
      case 'warning':
      case 'suspend':
        return 'text-yellow-600 hover:bg-gray-100 hover:text-yellow-900';
      case 'info':
      case 'edit':
        return 'text-blue-600 hover:bg-gray-100 hover:text-blue-900';
      case 'resend':
        return 'text-blue-600 hover:bg-gray-100 hover:text-blue-900';
      default:
        return 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`icon-aligned h-8 w-8 rounded transition-colors ${getVariantStyles()} ${className}`}
      title={title}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
