import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StoreLookupEmptyState } from './StoreLookupEmptyState'
import { storeLookupEmptyStateMock } from './StoreLookupEmptyState.mock'
describe('StoreLookupEmptyState', () => {
  it('renders the lookup guidance', () => {
    render(
      <StoreLookupEmptyState
        mascotSrc={storeLookupEmptyStateMock.mascotSrc}
        title={storeLookupEmptyStateMock.title}
      >
        {storeLookupEmptyStateMock.message}
      </StoreLookupEmptyState>
    )
    expect(
      screen.getByText(storeLookupEmptyStateMock.message)
    ).toBeInTheDocument()
  })
})
