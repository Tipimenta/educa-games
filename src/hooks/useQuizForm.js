import { useCallback, useState } from 'react';

import { validateSingleField } from '../schemas/helpers';
import { quizOptionSchema, quizPointsSchema, quizQuestionTextSchema } from '../schemas/quizSchema';

export const useQuizForm = () => {
  const [errors, setErrors] = useState({});

  const setQuestionError = useCallback((qIndex, message) => {
    setErrors((prev) => ({ ...prev, [qIndex]: { ...(prev[qIndex] || {}), text: message || '' } }));
  }, []);

  const setOptionError = useCallback((qIndex, oIndex, message) => {
    setErrors((prev) => ({
      ...prev,
      [qIndex]: {
        ...(prev[qIndex] || {}),
        options: { ...((prev[qIndex] && prev[qIndex].options) || {}), [oIndex]: message || '' },
      },
    }));
  }, []);

  const setPointsError = useCallback((qIndex, message) => {
    setErrors((prev) => ({
      ...prev,
      [qIndex]: { ...(prev[qIndex] || {}), points: message || '' },
    }));
  }, []);

  const onQuestionTextChange = useCallback(
    (qIndex, value) => {
      const err = validateSingleField(quizQuestionTextSchema, { text: value }, 'text');
      setQuestionError(qIndex, err || '');
    },
    [setQuestionError]
  );

  const onQuestionTextBlur = useCallback(
    (qIndex, value) => {
      const err = validateSingleField(quizQuestionTextSchema, { text: value }, 'text');
      setQuestionError(qIndex, err || '');
    },
    [setQuestionError]
  );

  const onOptionChange = useCallback(
    (qIndex, oIndex, value) => {
      const err = validateSingleField(quizOptionSchema, { option: value }, 'option');
      setOptionError(qIndex, oIndex, err || '');
    },
    [setOptionError]
  );

  const onOptionBlur = useCallback(
    (qIndex, oIndex, value) => {
      const err = validateSingleField(quizOptionSchema, { option: value }, 'option');
      setOptionError(qIndex, oIndex, err || '');
    },
    [setOptionError]
  );

  const onPointsChange = useCallback(
    (qIndex, points) => {
      const msg = typeof points === 'number' ? '' : 'Pontos da aula são obrigatórios';
      setPointsError(qIndex, msg);
    },
    [setPointsError]
  );

  const onPointsBlur = useCallback(
    (qIndex, points) => {
      const payload = typeof points === 'number' ? { points } : {};
      const err = validateSingleField(quizPointsSchema, payload, 'points');
      setPointsError(qIndex, err || '');
    },
    [setPointsError]
  );

  const getQuestionError = useCallback((qIndex) => errors[qIndex]?.text || '', [errors]);
  const getOptionError = useCallback(
    (qIndex, oIndex) => errors[qIndex]?.options?.[oIndex] || '',
    [errors]
  );
  const getPointsError = useCallback((qIndex) => errors[qIndex]?.points || '', [errors]);

  return {
    errors,
    onQuestionTextChange,
    onQuestionTextBlur,
    onOptionChange,
    onOptionBlur,
    onPointsChange,
    onPointsBlur,
    getQuestionError,
    getOptionError,
    getPointsError,
  };
};
