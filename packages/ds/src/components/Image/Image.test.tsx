import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Image } from './Image'
import styles from './Image.module.css'

const placeholder = <span data-testid="placeholder">sem foto</span>

describe(Image.name, () => {
  it('renders only the placeholder when there is no src', () => {
    // Arrange / Act
    render(<Image placeholder={placeholder} alt="" />)

    // Assert
    expect(screen.getByTestId('placeholder')).toBeInTheDocument()
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
  })

  it('keeps the image transparent until the file finishes loading', () => {
    // Arrange / Act
    render(<Image src="/burger.jpg" placeholder={placeholder} alt="" />)

    // Assert
    expect(screen.getByRole('presentation')).toHaveClass(styles.hidden)
    expect(screen.getByTestId('placeholder')).toBeInTheDocument()
  })

  it('reveals the image once it loads', () => {
    // Arrange
    render(<Image src="/burger.jpg" placeholder={placeholder} alt="" />)

    // Act
    fireEvent.load(screen.getByRole('presentation'))

    // Assert
    expect(screen.getByRole('presentation')).toHaveClass(styles.visible)
  })

  it('falls back to the placeholder when the file fails', () => {
    // Arrange
    render(<Image src="/gone.jpg" placeholder={placeholder} alt="" />)

    // Act
    fireEvent.error(screen.getByRole('presentation'))

    // Assert
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

    // Act
    render(<Image src="/cached.jpg" placeholder={placeholder} alt="" />)

    // Assert
    expect(screen.getByRole('presentation')).toHaveClass(styles.visible)

    Reflect.deleteProperty(HTMLImageElement.prototype, 'complete')
    Reflect.deleteProperty(HTMLImageElement.prototype, 'naturalWidth')
  })

  it('goes back to loading when the src changes', () => {
    // Arrange
    const { rerender } = render(
      <Image src="/a.jpg" placeholder={placeholder} alt="" />
    )
    fireEvent.load(screen.getByRole('presentation'))
    expect(screen.getByRole('presentation')).toHaveClass(styles.visible)

    // Act
    rerender(<Image src="/b.jpg" placeholder={placeholder} alt="" />)

    // Assert
    expect(screen.getByRole('presentation')).toHaveClass(styles.hidden)
  })
})
