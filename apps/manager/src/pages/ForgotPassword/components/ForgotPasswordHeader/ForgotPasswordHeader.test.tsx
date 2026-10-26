import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ForgotPasswordHeader } from './ForgotPasswordHeader'
import { forgotPasswordHeaderMock } from './ForgotPasswordHeader.mock'

describe(ForgotPasswordHeader.name, () => {
  it('names the screen', () => {
    render(<ForgotPasswordHeader />)

    expect(
      screen.getByRole('heading', { name: forgotPasswordHeaderMock.title })
    ).toBeInTheDocument()
  })
})
