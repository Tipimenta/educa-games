import { useCallback, useEffect, useRef, useState } from 'react';

import { isValid, validateAll, validateSingleField } from '../schemas/helpers';

export const useForm = ({ initialValues = {}, schema, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    const hasChanged = JSON.stringify(initialValuesRef.current) !== JSON.stringify(initialValues);
    if (hasChanged) {
      initialValuesRef.current = initialValues;
      setValues((prev) => {
        const updated = { ...prev };
        let hasChanges = false;
        Object.keys(initialValues).forEach((key) => {
          if (initialValues[key] !== prev[key] && !touched[key]) {
            updated[key] = initialValues[key];
            hasChanges = true;
          }
        });
        return hasChanges ? updated : prev;
      });
    }
  }, [initialValues, touched]);

  const touchedRef = useRef(touched);
  const valuesRef = useRef(values);
  const schemaRef = useRef(schema);

  touchedRef.current = touched;
  valuesRef.current = values;
  schemaRef.current = schema;

  const handleChange = useCallback((field, value) => {
    setValues((prev) => {
      const newValues = { ...prev, [field]: value };
      valuesRef.current = newValues;

      if (touchedRef.current[field] && schemaRef.current) {
        const error = validateSingleField(
          schemaRef.current,
          { ...touchedRef.current, ...newValues, [field]: value },
          field
        );
        setErrors((prevErrors) => ({ ...prevErrors, [field]: error || '' }));
      }

      return newValues;
    });
  }, []);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (schema) {
      const error = validateSingleField(schema, values, field);
      setErrors((prev) => ({ ...prev, [field]: error || '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (schema) {
      const validationErrors = validateAll(schema, values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

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

  const setFieldValue = useCallback(
    (field, value) => {
      handleChange(field, value);
    },
    [handleChange]
  );

  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const isFormValid = schema ? isValid(schema, values) : true;

  const setTouchedField = useCallback((field, value = true) => {
    if (typeof field === 'object') {
      setTouched(field);
    } else {
      setTouched((prev) => ({ ...prev, [field]: value }));
    }
  }, []);

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
