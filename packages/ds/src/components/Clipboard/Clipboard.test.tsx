import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Clipboard } from './Clipboard'

describe(Clipboard.name, () => {
  it('renders the value in a read-only field', () => {
    render(<Clipboard value="pix-code" />)
    const input = document.querySelector('input')
    expect(input).toHaveValue('pix-code')
    expect(input).toHaveAttribute('readonly')
  })

  it('writes to the clipboard and fires onCopy on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const onCopy = vi.fn()
    render(<Clipboard value="pix-code" onCopy={onCopy} />)

    await userEvent.click(screen.getByText('Copiar'))

    expect(writeText).toHaveBeenCalledWith('pix-code')
  })
})
