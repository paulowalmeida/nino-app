import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CONSUMERS_CAPABILITIES } from '@pages/Consumers/constants/consumers.constants'

import { ConsumersEmptyState } from './ConsumersEmptyState'
import { consumersEmptyStateMock } from './ConsumersEmptyState.mock'

describe(ConsumersEmptyState.name, () => {
  it('explains an empty base and lists what the screen does', () => {
    render(<ConsumersEmptyState search="" />)

    expect(screen.getByText(consumersEmptyStateMock.title)).toBeInTheDocument()
    CONSUMERS_CAPABILITIES.forEach(({ title }) =>
      expect(screen.getByText(title)).toBeInTheDocument()
    )
  })

  it('keeps a single line when the search finds nobody', () => {
    render(<ConsumersEmptyState search={consumersEmptyStateMock.search} />)

    expect(screen.getByText(/Nenhum cliente com "ana"/)).toBeInTheDocument()
    expect(
      screen.queryByText(consumersEmptyStateMock.title)
    ).not.toBeInTheDocument()
  })
})
