import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Company } from './Company'

vi.mock('@pages/Company/facades/useCompanyFacade/useCompanyFacade', () => ({
  useCompanyFacade: () => ({
    query: { data: undefined, isPending: false },
    save: { mutate: vi.fn(), isPending: false },
  }),
}))
vi.mock('@pages/Company/components/CompanyCard/CompanyCard', () => ({
  CompanyCard: () => <div>company card</div>,
}))

describe(Company.name, () => {
  it('composes the heading and the company card', () => {
    render(<Company />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Empresa' })
    ).toBeInTheDocument()
    expect(screen.getByText('company card')).toBeInTheDocument()
  })
})
