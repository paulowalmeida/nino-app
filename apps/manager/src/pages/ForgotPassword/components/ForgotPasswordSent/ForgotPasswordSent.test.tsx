import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ForgotPasswordSent } from './ForgotPasswordSent'
import { forgotPasswordSentMock } from './ForgotPasswordSent.mock'

const renderSent = (onUseAnotherEmail = vi.fn()) => {
  render(
    <ForgotPasswordSent
      email={forgotPasswordSentMock.email}
      onUseAnotherEmail={onUseAnotherEmail}
    />
  )
  return onUseAnotherEmail
}

describe('ForgotPasswordSent', () => {
  it('names the address the link was sent to', () => {
    renderSent()

    expect(screen.getByText(forgotPasswordSentMock.email)).toBeInTheDocument()
  })

  it('announces the outcome politely, without alarming', () => {
    renderSent()

    expect(screen.getByRole('status')).toHaveTextContent(
      forgotPasswordSentMock.flagLabel
    )
  })

  it('states how long the link lasts', () => {
    renderSent()

    expect(screen.getByRole('status')).toHaveTextContent('vale por 1 hora')
  })

  it('offers a way back when the address was wrong', () => {
    const onUseAnotherEmail = renderSent()

    fireEvent.click(
      screen.getByRole('button', { name: forgotPasswordSentMock.retryLabel })
    )

    expect(onUseAnotherEmail).toHaveBeenCalledTimes(1)
  })
})
