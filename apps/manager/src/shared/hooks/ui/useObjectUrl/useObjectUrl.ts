import { useCallback, useSyncExternalStore } from 'react'

type ObjectUrlEntry = { url: string; subscribers: number }

const entries = new Map<File, ObjectUrlEntry>()

const acquire = (file: File) => {
  const entry = entries.get(file)
  if (entry) {
    entry.subscribers += 1
    return
  }
  entries.set(file, { url: URL.createObjectURL(file), subscribers: 1 })
}

const release = (file: File) => {
  const entry = entries.get(file)
  if (!entry) return
  entry.subscribers -= 1
  if (entry.subscribers > 0) return
  URL.revokeObjectURL(entry.url)
  entries.delete(file)
}

/*
 * WHY: a URL de blob é um recurso externo com ciclo de vida (criar ao usar,
 * revogar ao largar). Guardá-la em useState dentro de um effect força um render
 * extra; assinar como store externa mantém criação e revogação no mesmo lugar e
 * sobrevive ao mount/unmount duplo do StrictMode.
 */
export const useObjectUrl = (file?: File): string | undefined => {
  const subscribe = useCallback(
    () => {
      if (!file) return () => undefined
      acquire(file)
      return () => release(file)
    },
    [file]
  )
  const getSnapshot = useCallback(
    () => (file ? entries.get(file)?.url : undefined),
    [file]
  )

  return useSyncExternalStore(subscribe, getSnapshot)
}
