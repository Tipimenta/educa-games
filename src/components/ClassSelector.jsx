export default function ClassSelector({
  classes,
  selectedClasses,
  onChange,
  namePrefix = 'class',
  className = '',
}) {
  const handleToggle = (classId) => {
    if (selectedClasses.includes(classId)) {
      onChange(selectedClasses.filter((id) => id !== classId));
    } else {
      onChange([...selectedClasses, classId]);
    }
  };

  return (
    <div className={`space-y-2 rounded-lg border p-4 ${className}`}>
      {classes.map((classItem) => (
        <div key={classItem.id} className="flex items-center">
          <input
            type="checkbox"
            id={`${namePrefix}-${classItem.id}`}
            checked={selectedClasses.includes(classItem.id)}
            onChange={() => handleToggle(classItem.id)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor={`${namePrefix}-${classItem.id}`} className="ml-3 text-sm text-gray-700">
            {classItem.name}
          </label>
        </div>
      ))}
    </div>
  );
}
