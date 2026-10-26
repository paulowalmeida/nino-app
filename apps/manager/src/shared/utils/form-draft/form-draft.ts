const PREFIX = 'nino.draft.'

/**
 * Form drafts survive a closed tab, a dead battery or a lost connection: the
 * store form is long and typed on a phone, so losing it means typing the whole
 * address again. Values are read once on mount and cleared on success.
 */
export const readDraft = <T>(key: string): Partial<T> | null => {
  try {
    const stored = window.localStorage.getItem(PREFIX + key)
    return stored ? (JSON.parse(stored) as Partial<T>) : null
  } catch {
    return null
  }
}

export const writeDraft = <T>(key: string, values: Partial<T>): void => {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(values))
  } catch {
    /* private mode or full quota: the draft is a courtesy, never a blocker */
  }
}

export const clearDraft = (key: string): void => {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    /* nothing to recover from: the draft is already unreachable */
  }
}
