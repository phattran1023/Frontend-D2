import { Transform, TransformFnParams } from "class-transformer";

export function Default(defaultValue: unknown) {
  return Transform((params: TransformFnParams) => {
    if (params.value !== null && params.value !== undefined) {
      return params.value;
    }
    if (typeof defaultValue === 'function') {
      return defaultValue();
    }
    if (Array.isArray(defaultValue)) {
      return [...defaultValue];
    }
    if (typeof defaultValue === 'object') {
      return (defaultValue === null) ? null : { ...defaultValue };
    }
    return defaultValue;
  });
}
