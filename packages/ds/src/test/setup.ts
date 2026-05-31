import '@testing-library/jest-dom'

// jsdom does not implement pointer capture APIs required by Radix UI
window.HTMLElement.prototype.hasPointerCapture = () => false
window.HTMLElement.prototype.setPointerCapture = () => {}
window.HTMLElement.prototype.releasePointerCapture = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}
// jsdom does not implement scrollTo (used by @zag-js select to scroll content)
window.HTMLElement.prototype.scrollTo = () => {}

// jsdom does not implement ResizeObserver (used by @radix-ui/react-tooltip)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
