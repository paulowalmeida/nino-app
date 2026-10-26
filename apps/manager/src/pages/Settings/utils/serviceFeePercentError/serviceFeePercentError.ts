export const SERVICE_FEE_MAX_PERCENT = 20

export const serviceFeePercentValue = (percentText: string): number =>
  Number(percentText.replace(',', '.'))

export const serviceFeePercentError = (
  percentText: string
): string | undefined => {
  const percent = serviceFeePercentValue(percentText)
  if (!percentText.trim() || !Number.isFinite(percent) || percent <= 0) {
    return 'Informe a porcentagem da taxa.'
  }
  if (percent > SERVICE_FEE_MAX_PERCENT) {
    return `A taxa vai até ${SERVICE_FEE_MAX_PERCENT}%.`
  }
  return undefined
}
