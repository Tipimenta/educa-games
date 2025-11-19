import Badge from './Badge';

const LatestBadges = ({ badges = [] }) => {
  if (!badges || badges.length === 0) {
    return (
      <span className="text-xs text-gray-400">Ainda não há conquistas</span>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {badges.map((badge) => (
        <Badge key={badge.type} type={badge.type} />
      ))}
    </div>
  );
};

export default LatestBadges;

