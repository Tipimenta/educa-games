import Input from './Input';
import ErrorMessage from './ErrorMessage';
import { onlyDigits } from '../utils/text';

export default function PointsField({
  label = 'Pontos',
  value,
  errorMessage = '',
  onChange,
  onChangeValidate,
  onBlurValidate,
  className = '',
  inputClassName = 'w-24',
}) {
  const strValue = typeof value === 'number' ? String(value) : '';

  return (
    <div className={`flex flex-col ${className}`}>
      {label ? (
        <label className="text-xs font-medium text-gray-600">{label}</label>
      ) : null}
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={strValue}
        onChange={(e) => {
          const digits = onlyDigits(e.target.value);
          const nextVal = digits.length ? parseInt(digits, 10) : undefined;
          if (typeof onChange === 'function') onChange(nextVal);
          if (typeof onChangeValidate === 'function') onChangeValidate(nextVal);
        }}
        onBlur={() => {
          const nextVal = typeof value === 'number' ? value : undefined;
          if (typeof onBlurValidate === 'function') onBlurValidate(nextVal);
        }}
        className={inputClassName}
        error={!!errorMessage}
      />
      <ErrorMessage message={errorMessage} />
    </div>
  );
}