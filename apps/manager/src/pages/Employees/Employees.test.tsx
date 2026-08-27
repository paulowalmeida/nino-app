import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Employees } from './Employees'

vi.mock('./components/EmployeesHeader/EmployeesHeader', () => ({ EmployeesHeader: () => <div>header</div> }))
vi.mock('./components/EmployeesContent/EmployeesContent', () => ({ EmployeesContent: () => <div>content</div> }))

describe(Employees.name, () => {
  it('composes the employees screen regions', () => {
    render(<Employees />)
    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
