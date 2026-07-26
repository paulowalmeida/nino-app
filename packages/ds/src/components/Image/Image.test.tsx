import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Image } from './Image'

const placeholder = <span data-testid="placeholder">sem foto</span>

describe(Image.displayName!, () => {
  it('renders only the placeholder when there is no src', () => {
    render(<Image placeholder={placeholder} alt="" />)

    expect(screen.getByTestId('placeholder')).toBeInTheDocument()
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
  })

  it('keeps the image transparent until the file finishes loading', () => {
    render(<Image src="/burger.jpg" placeholder={placeholder} alt="" />)

    expect(screen.getByRole('presentation')).toHaveClass('opacity-0')
    expect(screen.getByTestId('placeholder')).toBeInTheDocument()
  })

  it('reveals the image once it loads', () => {
    render(<Image src="/burger.jpg" placeholder={placeholder} alt="" />)

    fireEvent.load(screen.getByRole('presentation'))

    expect(screen.getByRole('presentation')).toHaveClass('opacity-100')
  })

  it('falls back to the placeholder when the file fails', () => {
    render(<Image src="/gone.jpg" placeholder={placeholder} alt="" />)

    fireEvent.error(screen.getByRole('presentation'))

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
    expect(screen.getByTestId('placeholder')).toBeInTheDocument()
  })

  /**
   * A imagem em cache termina antes do React pendurar o onLoad — sem checar
   * `complete` na montagem ela ficaria invisível pra sempre.
   */
  it('reveals an already cached image that never fires onLoad', () => {
    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      configurable: true,
      get: () => true,
    })
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      configurable: true,
      get: () => 800,
    })

    render(<Image src="/cached.jpg" placeholder={placeholder} alt="" />)

    expect(screen.getByRole('presentation')).toHaveClass('opacity-100')

    Reflect.deleteProperty(HTMLImageElement.prototype, 'complete')
    Reflect.deleteProperty(HTMLImageElement.prototype, 'naturalWidth')
  })

  it('goes back to loading when the src changes', () => {
    const { rerender } = render(
      <Image src="/a.jpg" placeholder={placeholder} alt="" />
    )
    fireEvent.load(screen.getByRole('presentation'))
    expect(screen.getByRole('presentation')).toHaveClass('opacity-100')

    rerender(<Image src="/b.jpg" placeholder={placeholder} alt="" />)

    expect(screen.getByRole('presentation')).toHaveClass('opacity-0')
  })
})
