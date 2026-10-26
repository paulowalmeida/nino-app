import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoryIconPicker } from './CategoryIconPicker'
import { categoryIconPickerMock } from './CategoryIconPicker.mock'

describe(CategoryIconPicker.name, () => {
  it('emits the automatic option and selected icon', () => {
    const onChange = vi.fn()
    render(<CategoryIconPicker value={categoryIconPickerMock.value} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Escolher ícone automático' }))
    expect(onChange).toHaveBeenCalledWith(null)
    expect(screen.getByRole('button', { name: /pizza/i })).toHaveAttribute('aria-pressed', 'true')
  })
})
