import type { ReactNode } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PauseDurationModal } from './PauseDurationModal'
import { pauseDurationModalMock } from './PauseDurationModal.mock'

vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({ body, footer }: { body: ReactNode; footer: ReactNode }) => (
    <div>
      {body}
      {footer}
    </div>
  ),
}))

describe('PauseDurationModal', () => {
  it('renders and interacts with the pause duration choices', () => {
    const onReasonChange = vi.fn()
    const onSelectDuration = vi.fn()
    const onCancel = vi.fn()
    render(
      <PauseDurationModal
        open={pauseDurationModalMock.open}
        onOpenChange={vi.fn()}
        openedAt={Date.now()}
        timezone="America/Belem"
        reason={pauseDurationModalMock.reason}
        onReasonChange={onReasonChange}
        onSelectDuration={onSelectDuration}
        onCancel={onCancel}
        isPending={false}
      />
    )

    expect(screen.getByText(/O cliente vê a loja fechada/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    fireEvent.change(
      screen.getByPlaceholderText('Chuva forte, sem entregador...'),
      {
        target: { value: 'Chuva' },
      }
    )
    screen.getByRole('button', { name: /30 min/i }).click()
    screen.getByRole('button', { name: 'Cancelar' }).click()

    expect(onSelectDuration).toHaveBeenCalled()
    expect(onReasonChange).toHaveBeenCalledWith('Chuva')
    expect(onCancel).toHaveBeenCalled()
  })

  it('supports an indefinite pause while a duration is pending', () => {
    const onSelectDuration = vi.fn()

    render(
      <PauseDurationModal
        open
        onOpenChange={vi.fn()}
        openedAt={null}
        timezone={null}
        reason=""
        onReasonChange={vi.fn()}
        onSelectDuration={onSelectDuration}
        onCancel={vi.fn()}
        isPending
        pendingMinutes={30}
      />
    )

    screen.getByRole('button', { name: /Até eu reabrir/ }).click()

    expect(onSelectDuration).toHaveBeenCalledWith(undefined)
  })
})
