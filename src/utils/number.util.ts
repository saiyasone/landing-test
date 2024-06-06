export function prettyNumberFormat(
  number: any,
  options = {},
  defaultValue = "00.00",
) {
  return (number || defaultValue).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    ...options,
  });
}
