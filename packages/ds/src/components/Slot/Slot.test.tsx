import { createRef } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Slot } from './Slot'

describe(Slot.name, () => {
  it('renders the child instead of a node of its own', () => {
    // Arrange / Act
    const { container } = render(
      <Slot>
        <a href="/orders">Ver mais</a>
      </Slot>
    )

    // Assert
    expect(container.firstChild).toBe(screen.getByRole('link'))
    expect(container.childElementCount).toBe(1)
  })

  it('merges its classes with the ones the child already had', () => {
    // Arrange / Act
    render(
      <Slot className="rounded-full">
        <a href="/orders" className="text-brand">
          Ver mais
        </a>
      </Slot>
    )

    // Assert
    expect(screen.getByRole('link')).toHaveClass('rounded-full', 'text-brand')
  })

  it('lets the child win a conflicting Tailwind class', () => {
    // Arrange / Act
    render(
      <Slot className="px-4">
        <a href="/orders" className="px-8">
          Ver mais
        </a>
      </Slot>
    )

    // Assert
    expect(screen.getByRole('link')).toHaveClass('px-8')
    expect(screen.getByRole('link')).not.toHaveClass('px-4')
  })

  it('merges inline style, keeping the child on top', () => {
    // Arrange / Act
    render(
      <Slot style={{ color: 'red', margin: '4px' }}>
        <a href="/orders" style={{ color: 'blue' }}>
          Ver mais
        </a>
      </Slot>
    )

    // Assert
    expect(screen.getByRole('link')).toHaveStyle({
      color: 'rgb(0, 0, 255)',
      margin: '4px',
    })
  })

  it('passes its own props down to the child', () => {
    // Arrange / Act
    render(
      <Slot aria-busy="true" data-testid="slotted">
        <a href="/orders">Ver mais</a>
      </Slot>
    )

    // Assert
    expect(screen.getByTestId('slotted')).toHaveAttribute('aria-busy', 'true')
  })

  it('keeps the child prop when both sides declare the same one', () => {
    // Arrange / Act
    render(
      <Slot href="/from-slot">
        <a href="/from-child">Ver mais</a>
      </Slot>
    )

    // Assert
    expect(screen.getByRole('link')).toHaveAttribute('href', '/from-child')
  })

  it('reaches the DOM node through both refs at once', () => {
    // Arrange
    const slotRef = createRef<HTMLElement>()
    const childRef = vi.fn()

    // Act
    render(
      <Slot ref={slotRef}>
        <a href="/orders" ref={childRef}>
          Ver mais
        </a>
      </Slot>
    )

    // Assert
    expect(slotRef.current).toBe(screen.getByRole('link'))
    expect(childRef).toHaveBeenCalledWith(screen.getByRole('link'))
  })

  it('returns the child untouched when it is not an element', () => {
    // Arrange / Act
    const { container } = render(<Slot>plain text</Slot>)

    // Assert
    expect(container).toHaveTextContent('plain text')
  })

  it('renders nothing when there is no child to clone', () => {
    // Arrange / Act
    const { container } = render(<Slot>{null}</Slot>)

    // Assert
    expect(container).toBeEmptyDOMElement()
  })
})
