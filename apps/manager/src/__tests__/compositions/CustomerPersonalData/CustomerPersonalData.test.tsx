import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  CustomerPersonalData,
} from '@compositions/CustomerPersonalData/CustomerPersonalData'

import { customerHistory } from './CustomerPersonalData.mock'

describe(CustomerPersonalData.name, () => {
  it('shows the formatted phone, e-mail and cpf', () => {
    // Arrange / Act
    render(<CustomerPersonalData customer={customerHistory} />)

    // Assert
    expect(screen.getByText('(11) 99999-0000')).toBeInTheDocument()
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument()
  })

  it('shows a dash for e-mail and cpf when the customer has neither', () => {
    // Arrange
    const customer = { ...customerHistory, email: null, cpf: null }

    // Act
    render(<CustomerPersonalData customer={customer} />)

    // Assert
    expect(screen.getAllByText('—')).toHaveLength(2)
  })
})
