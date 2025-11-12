function TabButton({ label, isActive, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 px-4 py-3 text-base font-medium transition-colors ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      } ${className}`}
    >
      {label}
    </button>
  );
}

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  containerClassName = '',
  align = 'center',
  navClassName = '',
  fluid = false,
}) {
  const justifyClass =
    align === 'left' || align === 'start'
      ? 'justify-start'
      : align === 'right' || align === 'end'
      ? 'justify-end'
      : 'justify-center';
  const widthClass = fluid ? '' : 'mx-auto max-w-[95%]';
  return (
    <div className={`mb-8 ${containerClassName}`}>
      <div className={`${widthClass} border-b border-gray-200 ${className}`}>
        <nav className={`-mb-px flex ${justifyClass} ${navClassName}`}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

export { TabButton };
