import type { ReactNode } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RemoveZoneModal } from './RemoveZoneModal'
import { removeZoneModalMock } from './RemoveZoneModal.mock'

vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({ body, footer }: { body: ReactNode; footer: ReactNode }) => (
    <div>{body}{footer}</div>
  ),
}))

describe('RemoveZoneModal', () => {
  it('confirms the contextual delivery region removal', () => {
    const onConfirm = vi.fn()

    render(
      <RemoveZoneModal
        {...removeZoneModalMock}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />
    )

    expect(screen.getByText(/A região Centro deixará de aparecer/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Remover região' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
