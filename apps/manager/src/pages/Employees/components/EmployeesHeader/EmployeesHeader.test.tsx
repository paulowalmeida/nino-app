import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmployeesHeader } from './EmployeesHeader'

describe(EmployeesHeader.name, () => {
  it('presents the team page heading and explanation', () => {
    render(<EmployeesHeader />)
    expect(
      screen.getByRole('heading', { name: 'Colaboradores' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Cada pessoa entra com a própria conta/)
    ).toBeInTheDocument()
  })
})
