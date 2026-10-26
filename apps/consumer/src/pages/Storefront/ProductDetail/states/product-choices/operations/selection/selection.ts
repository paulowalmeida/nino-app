import type { SetProductChoicesState } from '@pages/Storefront/ProductDetail/types/SetProductChoicesState.type'

export const selectChoice = (
  set: SetProductChoicesState,
  groupId: string,
  optionId: string
) =>
  set((state) => ({
    selections: { ...state.selections, [groupId]: [optionId] },
  }))

/**
 * WHY: no teto, a opção mais antiga sai para dar lugar à nova — travar o
 * clique deixaria o cliente sem saber por que nada aconteceu.
 */
export const toggleChoice = (
  set: SetProductChoicesState,
  groupId: string,
  optionId: string,
  limit: number
) =>
  set((state) => {
    const chosen = state.selections[groupId] ?? []
    const next = chosen.includes(optionId)
      ? chosen.filter((id) => id !== optionId)
      : [...chosen, optionId].slice(-limit)

    return { selections: { ...state.selections, [groupId]: next } }
  })
