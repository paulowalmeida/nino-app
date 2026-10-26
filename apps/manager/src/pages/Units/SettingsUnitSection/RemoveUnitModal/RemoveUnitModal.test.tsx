import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RemoveUnitModal } from './RemoveUnitModal'
import { removeUnitModalMock } from './RemoveUnitModal.mock'

const onConfirm = vi.fn()
const onOpenChange = vi.fn()

const renderModal = (open = true, loading = false) =>
  render(
    <RemoveUnitModal
      open={open}
      onOpenChange={onOpenChange}
      unitName={removeUnitModalMock.unitName}
      loading={loading}
      onConfirm={onConfirm}
    />
  )

describe('RemoveUnitModal', () => {
  beforeEach(() => vi.clearAllMocks())

  it('does not open when requested closed', () => {
    renderModal(false)

    expect(screen.queryByText('Excluir esta loja?')).not.toBeInTheDocument()
  })

  it('warns that the history goes with the store', () => {
    renderModal()

    expect(screen.getByText(/o histórico dela vai junto/)).toBeInTheDocument()
  })

  it('keeps the confirmation closed until the name matches', async () => {
    renderModal()

    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled()

    await userEvent.type(
      screen.getByLabelText(/Para confirmar/),
      removeUnitModalMock.wrongName
    )

    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled()
  })

  it('closes the store once the name is typed in full', async () => {
    renderModal()

    await userEvent.type(
      screen.getByLabelText(/Para confirmar/),
      removeUnitModalMock.unitName
    )
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(onConfirm).toHaveBeenCalled()
  })

  it('holds the confirmation while the first request runs', async () => {
    renderModal(true, true)

    await userEvent.type(
      screen.getByLabelText(/Para confirmar/),
      removeUnitModalMock.unitName
    )

    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('gives up when the person cancels', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
