export function validateSingleField(schema, data, field) {
  const result = schema.safeParse(data);
  if (result.success) return '';
  const issue = result.error.issues.find((i) => i.path[0] === field);
  return issue ? issue.message : '';
}

export function validateAll(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return {};
  const errors = {};
  for (const i of result.error.issues) {
    const key = i.path[0];
    if (!errors[key]) errors[key] = i.message;
  }
  return errors;
}

export function isValid(schema, data) {
  return schema.safeParse(data).success;
}
