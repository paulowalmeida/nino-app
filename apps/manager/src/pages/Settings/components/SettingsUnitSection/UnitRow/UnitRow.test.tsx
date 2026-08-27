import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UnitRow } from './UnitRow'

describe('UnitRow', () => {
  it('renders the unit name', () => {
    render(<MemoryRouter><UnitRow name="Centro" companyName="Nino" to="." isCurrent isMain={false} delay={{}} onRemove={() => undefined} /></MemoryRouter>)
    expect(screen.getByText('Centro')).toBeInTheDocument()
  })
})
