import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DisclosureTrigger } from './DisclosureTrigger'
import { disclosureTriggerMock } from './DisclosureTrigger.mock'

describe('DisclosureTrigger', () => {
  it('renders the optional-field label', () => {
    render(<DisclosureTrigger>{disclosureTriggerMock.label}</DisclosureTrigger>)

    expect(screen.getByText(disclosureTriggerMock.label)).toBeInTheDocument()
  })
})
