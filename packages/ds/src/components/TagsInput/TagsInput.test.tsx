import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TagsInput } from './TagsInput'

describe(TagsInput.displayName!, () => {
  it('renders the tags from value', () => {
    render(<TagsInput value={['react', 'tailwind']} onValueChange={vi.fn()} />)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('tailwind')).toBeInTheDocument()
  })

  it('creates a tag on type and Enter key', async () => {
    const onValueChange = vi.fn()
    render(<TagsInput onValueChange={onValueChange} placeholder="Adicionar" />)
    await userEvent.type(
      screen.getByPlaceholderText('Adicionar'),
      'nova{Enter}'
    )
    expect(onValueChange).toHaveBeenCalledWith(['nova'])
  })

  it('removes a tag via the delete button', async () => {
    const onValueChange = vi.fn()
    render(<TagsInput value={['a', 'b']} onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove a' }))
    expect(onValueChange).toHaveBeenCalledWith(['b'])
  })

  it('applies error state', () => {
    const { container } = render(<TagsInput error onValueChange={vi.fn()} />)
    expect(container.querySelector('[data-part="control"]')).toHaveClass(
      'border-danger'
    )
  })
})
