const FADE_MS = 260
const SAFETY_MS = 12000

/**
 * The splash lives in index.html, so it outlives the bundle download and the
 * root loader. It leaves only when the router has painted a route — dismissing
 * on first render would swap it for the same blank screen it exists to cover.
 */
export const dismissSplash = (): void => {
  const splash = document.getElementById('splash')
  if (!splash) return

  splash.dataset.leaving = 'true'
  window.setTimeout(() => splash.remove(), FADE_MS)
}

export const dismissSplashWhenReady = (isReady: () => boolean): void => {
  if (!document.getElementById('splash')) return

  const safety = window.setTimeout(dismissSplash, SAFETY_MS)

  const check = () => {
    if (!isReady()) {
      requestAnimationFrame(check)
      return
    }

    window.clearTimeout(safety)
    requestAnimationFrame(() => requestAnimationFrame(dismissSplash))
  }

  check()
}
