import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ResetPasswordHeader } from './ResetPasswordHeader'
import { resetPasswordHeaderMock } from './ResetPasswordHeader.mock'

describe(ResetPasswordHeader.name, () => {
  it('names the screen', () => {
    render(<ResetPasswordHeader />)

    expect(
      screen.getByRole('heading', { name: resetPasswordHeaderMock.title })
    ).toBeInTheDocument()
  })
})
