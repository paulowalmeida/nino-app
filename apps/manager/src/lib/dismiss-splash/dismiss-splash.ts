const FADE_MS = 260
const SAFETY_MS = 12000

export const dismissSplash = (): void => {
  const splash = document.getElementById('splash')
  if (!splash) return

  splash.dataset.leaving = 'true'
  window.setTimeout(() => splash.remove(), FADE_MS)
}

export const dismissSplashWhenReady = (isReady: () => boolean): void => {
  if (!document.getElementById('splash')) return

  let frameId: number | undefined

  const cancelPendingFrame = () => {
    if (frameId === undefined) return
    cancelAnimationFrame(frameId)
    frameId = undefined
  }

  const dismissWithCleanup = () => {
    cancelPendingFrame()
    dismissSplash()
  }

  const safety = window.setTimeout(dismissWithCleanup, SAFETY_MS)

  const check = () => {
    if (!document.getElementById('splash')) {
      window.clearTimeout(safety)
      cancelPendingFrame()
      return
    }

    if (!isReady()) {
      frameId = requestAnimationFrame(check)
      return
    }

    window.clearTimeout(safety)
    frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        frameId = undefined
        dismissSplash()
      })
    })
  }

  check()
}
