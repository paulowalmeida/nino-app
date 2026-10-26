import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { InlineEditCell } from './InlineEditCell'

const renderCell = (onCommit = vi.fn(), onReject = vi.fn()) => {
  render(
    <InlineEditCell
      display="R$ 5,00"
      value="5"
      label="taxa"
      inputMode="decimal"
      parse={(value) => (Number(value) >= 0 ? Number(value) : null)}
      onCommit={onCommit}
      onReject={onReject}
    />
  )
  return { onCommit, onReject }
}

describe(InlineEditCell.name, () => {
  it('turns into an input on click and saves when it loses focus', async () => {
    const { onCommit } = renderCell()

    await userEvent.click(screen.getByRole('button', { name: 'Editar taxa' }))
    const input = screen.getByRole('textbox', { name: 'taxa' })
    await userEvent.clear(input)
    await userEvent.type(input, '8')
    await userEvent.tab()

    expect(onCommit).toHaveBeenCalledWith(8)
    expect(screen.getByRole('button', { name: 'Editar taxa' })).toBeInTheDocument()
  })

  it('undoes with Escape and rejects text it cannot save', async () => {
    const { onCommit, onReject } = renderCell()

    await userEvent.click(screen.getByRole('button', { name: 'Editar taxa' }))
    await userEvent.keyboard('{Escape}')
    expect(onCommit).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Editar taxa' }))
    const input = screen.getByRole('textbox', { name: 'taxa' })
    await userEvent.clear(input)
    await userEvent.type(input, '-1')
    await userEvent.tab()
    expect(onReject).toHaveBeenCalled()
    expect(onCommit).not.toHaveBeenCalled()
  })
})
