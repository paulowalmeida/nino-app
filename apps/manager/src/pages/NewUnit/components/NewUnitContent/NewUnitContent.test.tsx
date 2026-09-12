import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NewUnitContent } from './NewUnitContent'

vi.mock('@pages/NewUnit/facades/useNewUnitFacade/useNewUnitFacade', () => ({
  useNewUnitFacade: () => ({
    typeOptions: [{ value: 'restaurant', label: 'Restaurante' }],
    submitStore: vi.fn(),
  }),
}))

describe('NewUnitContent', () => {
  it('renders the creation form and consumer preview', () => {
    render(<NewUnitContent />)
    expect(screen.getByText('Como o cliente vê')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir unidade' })).toBeInTheDocument()
  })
})
