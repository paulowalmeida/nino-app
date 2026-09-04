type SessionClear = () => void

let clear: SessionClear = () => undefined

export const registerSessionClear = (callback: SessionClear): void => {
  clear = callback
}

export const clearRegisteredSession = (): void => {
  clear()
}
