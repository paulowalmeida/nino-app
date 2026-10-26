import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SubscriptionSupportHint } from './SubscriptionSupportHint'

describe(SubscriptionSupportHint.name, () => {
  it('explains that changes affect every company unit', () => {
    render(<SubscriptionSupportHint />)

    expect(screen.getByText(/afetam todas as unidades/)).toBeInTheDocument()
  })
})
