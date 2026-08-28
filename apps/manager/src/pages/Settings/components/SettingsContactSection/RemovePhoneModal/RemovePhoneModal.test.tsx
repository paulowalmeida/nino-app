import type { ReactNode } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RemovePhoneModal } from './RemovePhoneModal'
import { removePhoneModalMock } from './RemovePhoneModal.mock'

vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({ body, footer }: { body: ReactNode; footer: ReactNode }) => (
    <div>{body}{footer}</div>
  ),
}))

describe('RemovePhoneModal', () => {
  it('confirms the contextual phone removal', () => {
    const onConfirm = vi.fn()

    render(
      <RemovePhoneModal
        {...removePhoneModalMock}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />
    )

    expect(screen.getByText(/O número \(91\) 99999-9999/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Remover telefone' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
