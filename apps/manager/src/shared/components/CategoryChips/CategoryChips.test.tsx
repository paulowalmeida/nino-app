import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoryChips } from './CategoryChips'
import { categoryChipsMock } from './CategoryChips.mock'

describe(CategoryChips.name, () => {
  it('renders categories and selects one', () => {
    const onChange = vi.fn()
    render(
      <CategoryChips {...categoryChipsMock} value={null} onChange={onChange} />
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Bebidas' }))
    expect(onChange).toHaveBeenCalledWith('drinks')
  })

  it('renders loading placeholders and all option', () => {
    const { container, rerender } = render(
      <CategoryChips
        categories={[]}
        value={null}
        onChange={vi.fn()}
        isPending
      />
    )
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
    rerender(
      <CategoryChips {...categoryChipsMock} value={null} onChange={vi.fn()} />
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Todas' }))
    expect(screen.getByRole('tab', { name: 'Todas' })).toBeInTheDocument()
    rerender(
      <CategoryChips
        {...categoryChipsMock}
        value="drinks"
        onChange={vi.fn()}
        allowAll={false}
      />
    )
    expect(screen.queryByRole('tab', { name: 'Todas' })).not.toBeInTheDocument()
  })

  /* Os ramos de gesto (estoura/cabe, vertical/horizontal, arrasto vs.
   * toque) são exaustivamente cobertos em useHorizontalDragScroll.test.tsx;
   * aqui só prova que o track real está ligado ao hook. */
  it('wires the track to the horizontal drag-scroll hook', () => {
    render(
      <CategoryChips {...categoryChipsMock} value={null} onChange={vi.fn()} />
    )
    const track = screen.getByRole('tablist')
    Object.defineProperty(track, 'scrollWidth', {
      value: 500,
      configurable: true,
    })
    Object.defineProperty(track, 'clientWidth', {
      value: 200,
      configurable: true,
    })
    /* WHY: jsdom não implementa scroll suave. */
    track.scrollBy = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft += left ?? 0
    })

    fireEvent.wheel(track, { deltaY: 120, deltaX: 0 })

    expect(track.scrollLeft).toBe(120)
  })
})
