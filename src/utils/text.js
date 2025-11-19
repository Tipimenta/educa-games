export const getPlainText = (html) => {
  const el = document.createElement('div');
  el.innerHTML = html || '';
  const text = el.textContent || '';
  return text;
};

export const onlyDigits = (s) => (s || '').replace(/\D+/g, '');