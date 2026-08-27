import type { ReactNode } from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EditEmailModal } from './EditEmailModal'
import { editEmailModalMock } from './EditEmailModal.mock'

vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({ body, footer, header }: { body: ReactNode; footer: ReactNode; header: ReactNode }) => (
    <div>
      {header}
      {body}
      {footer}
    </div>
  ),
}))

describe(EditEmailModal.name, () => {
  it('submits the changed e-mail and closes the modal', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()

    render(
      <EditEmailModal
        {...editEmailModalMock}
        onOpenChange={onOpenChange}
        onSave={onSave}
      />,
    )

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'novo@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar e-mail' }))

    await waitFor(() => expect(onSave).toHaveBeenCalledWith('novo@example.com'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows the save error when the update fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('failed'))

    render(
      <EditEmailModal
        {...editEmailModalMock}
        onOpenChange={vi.fn()}
        onSave={onSave}
      />,
    )

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'invalido@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar e-mail' }))

    expect(
      await screen.findByText(
        'Não foi possível salvar. Confira o e-mail e tente de novo.',
      ),
    ).toBeInTheDocument()
  })

  it('closes without saving when cancelled', () => {
    const onOpenChange = vi.fn()

    render(
      <EditEmailModal
        {...editEmailModalMock}
        onOpenChange={onOpenChange}
        onSave={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not reset the form while closed', () => {
    render(
      <EditEmailModal
        {...editEmailModalMock}
        open={false}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
      />,
    )

    expect(screen.getByRole('textbox')).toHaveValue('ana@example.com')
  })

  it('starts empty when no current e-mail exists', () => {
    render(
      <EditEmailModal
        {...editEmailModalMock}
        currentEmail={null}
        onOpenChange={vi.fn()}
        onSave={vi.fn()}
      />,
    )

    expect(screen.getByRole('textbox')).toHaveValue('')
  })
})
