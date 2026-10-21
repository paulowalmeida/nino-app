const isApple = (userAgent: string) => /Mac|iPhone|iPad/.test(userAgent)

export const shortcutLabel = (
  key: string,
  userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent
): string => (isApple(userAgent) ? `⌘${key}` : `Ctrl ${key}`)
