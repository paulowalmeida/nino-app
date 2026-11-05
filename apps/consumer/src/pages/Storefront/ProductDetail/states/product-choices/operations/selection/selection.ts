import type { SetProductChoicesState } from '@pages/Storefront/ProductDetail/types/SetProductChoicesState.type'

export const selectChoice = (
  set: SetProductChoicesState,
  groupId: string,
  optionId: string
) =>
  set((state) => ({
    selections: { ...state.selections, [groupId]: [optionId] },
  }))

export const toggleChoice = (
  set: SetProductChoicesState,
  groupId: string,
  optionId: string,
  limit: number
) =>
  set((state) => {
    const chosen = state.selections[groupId] ?? []
    if (chosen.includes(optionId)) {
      return {
        selections: {
          ...state.selections,
          [groupId]: chosen.filter((id) => id !== optionId),
        },
      }
    }

    if (chosen.length >= limit) return state

    return {
      selections: { ...state.selections, [groupId]: [...chosen, optionId] },
    }
  })
