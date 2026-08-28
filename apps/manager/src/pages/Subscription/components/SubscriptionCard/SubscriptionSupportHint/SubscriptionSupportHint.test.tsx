import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SubscriptionSupportHint } from './SubscriptionSupportHint'

describe(SubscriptionSupportHint.name, () => {
  it('explains how plan changes are handled', () => {
    render(<SubscriptionSupportHint />)

    expect(screen.getByText(/fale com o suporte/)).toBeInTheDocument()
  })
})
