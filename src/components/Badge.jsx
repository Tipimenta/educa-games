import { BADGE_IMAGES, BADGE_LABELS } from '../constants/badges';

const Badge = ({ type }) => {
  const badgeImage = BADGE_IMAGES[type];
  const badgeLabel = BADGE_LABELS[type];

  if (!badgeImage) return null;

  return (
    <div className="group relative flex items-center">
      <img
        src={badgeImage}
        alt={badgeLabel || type}
        className="h-8 w-8 cursor-pointer"
      />
      {badgeLabel && (
        <div className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
          {badgeLabel}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default Badge;

