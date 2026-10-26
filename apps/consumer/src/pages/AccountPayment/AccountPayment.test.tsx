import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AccountPayment } from './AccountPayment'

describe('AccountPayment', () => {
  it('renders the payment section headline', () => {
    render(<AccountPayment />)

    expect(screen.getByText('Seus cartões salvos')).toBeInTheDocument()
  })
})
