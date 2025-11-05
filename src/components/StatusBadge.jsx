import { translateStatus } from '../lib/utils';

export default function StatusBadge({ status, variant = 'default' }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translatedStatus = translateStatus(status);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getVariantStyles()}`}
    >
      {translatedStatus}
    </span>
  );
}
