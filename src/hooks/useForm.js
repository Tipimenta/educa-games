import { useState } from 'react';

import { isValid, validateAll, validateSingleField } from '../schemas/helpers';

export const useForm = ({ initialValues = {}, schema, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    // Validação em tempo real apenas para campos que foram tocados
    if (touched[field] && schema) {
      const error = validateSingleField(schema, { ...values, [field]: value }, field);
      setErrors((prev) => ({ ...prev, [field]: error || '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validar campo ao perder foco
    if (schema) {
      const error = validateSingleField(schema, values, field);
      setErrors((prev) => ({ ...prev, [field]: error || '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Marcar todos os campos como tocados
    const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    // Validar todos os campos
    if (schema) {
      const validationErrors = validateAll(schema, values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    // Executar submit
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const reset = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const setFieldValue = (field, value) => {
    handleChange(field, value);
  };

  const setFieldError = (field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const isFormValid = schema ? isValid(schema, values) : true;

  const setTouchedField = (field, value = true) => {
    if (typeof field === 'object') {
      setTouched(field);
    } else {
      setTouched((prev) => ({ ...prev, [field]: value }));
    }
  };

  const setAllErrors = (errs) => setErrors(errs);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setTouched: setTouchedField,
    setErrors: setAllErrors,
  };
};
