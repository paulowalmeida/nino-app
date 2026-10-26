import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AddressFormActions } from './AddressFormActions'

describe('AddressFormActions', () => {
  it('renders save and cancel actions', () => {
    render(<AddressFormActions isSaving={false} isValid onCancel={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: 'Salvar endereço' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('disables save while invalid or saving', () => {
    render(<AddressFormActions isSaving isValid={false} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Salvando…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })
})
