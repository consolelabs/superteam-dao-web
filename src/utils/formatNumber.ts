export function formatAmount(
  number: number,
  options: Intl.NumberFormatOptions = {},
) {
  return Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6,
    ...options,
  }).format(number)
}
