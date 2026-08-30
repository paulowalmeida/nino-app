export const changeDueTotalMock = 47.9

export const changeDueCasesMock = [
  { received: null, hasChange: false, isValid: true, amount: 0 },
  { received: 47.9, hasChange: true, isValid: true, amount: 0 },
  { received: 50, hasChange: true, isValid: true, amount: 2.1 },
  { received: 20, hasChange: true, isValid: false, amount: 0 },
  { received: Number.NaN, hasChange: false, isValid: false, amount: 0 },
] as const
