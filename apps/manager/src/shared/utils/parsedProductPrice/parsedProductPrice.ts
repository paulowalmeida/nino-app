export const parsedProductPrice = (value: string): number =>
  Number(value.replace(/\./g, '').replace(',', '.'))
