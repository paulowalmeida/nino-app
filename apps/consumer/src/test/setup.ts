import '@testing-library/jest-dom'

// jsdom does not implement pointer capture APIs required by Radix/Ark UI
window.HTMLElement.prototype.hasPointerCapture = () => false
window.HTMLElement.prototype.setPointerCapture = () => {}
window.HTMLElement.prototype.releasePointerCapture = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}

window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.IntersectionObserver = class IntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
} as unknown as typeof IntersectionObserver

/* WHY: a partir do Node 25 o runtime expõe um `localStorage` global próprio,
 * que sem `--localstorage-file` vem vazio e encobre o do jsdom — todo teste
 * que toca storage cai em `undefined`. Um Storage em memória devolve o
 * comportamento do navegador. */
class MemoryStorage implements Storage {
  private items = new Map<string, string>()
  get length() {
    return this.items.size
  }
  clear() {
    this.items.clear()
  }
  getItem(key: string) {
    return this.items.get(key) ?? null
  }
  key(index: number) {
    return [...this.items.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.items.delete(key)
  }
  setItem(key: string, value: string) {
    this.items.set(key, String(value))
  }
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
  if (typeof window[name]?.clear === 'function') continue
  const storage = new MemoryStorage()
  Object.defineProperty(window, name, { value: storage, configurable: true })
  Object.defineProperty(globalThis, name, {
    value: storage,
    configurable: true,
  })
}
