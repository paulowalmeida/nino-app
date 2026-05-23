import '@testing-library/jest-dom'

// jsdom does not implement pointer capture APIs required by Radix UI
window.HTMLElement.prototype.hasPointerCapture = () => false
window.HTMLElement.prototype.setPointerCapture = () => {}
window.HTMLElement.prototype.releasePointerCapture = () => {}
