import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PHONE_LIST_CAPABILITIES } from '@pages/Settings/constants/settings.constants'

import { PhoneListEmptyState } from './PhoneListEmptyState'
import { phoneListEmptyStateMock } from './PhoneListEmptyState.mock'

describe(PhoneListEmptyState.name, () => {
  it('names what is missing and lists what the section does', () => {
    render(<PhoneListEmptyState />)

    expect(screen.getByText(phoneListEmptyStateMock.title)).toBeInTheDocument()
    PHONE_LIST_CAPABILITIES.forEach(({ title }) =>
      expect(screen.getByText(title)).toBeInTheDocument()
    )
  })
})
