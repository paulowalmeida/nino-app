import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CompanyPickCard } from './CompanyPickCard'
import { companyPickCardMock } from './CompanyPickCard.mock'

describe('CompanyPickCard', () => {
  it('names the unit when the company has just one', () => {
    render(
      <CompanyPickCard
        companyName={companyPickCardMock.companyName}
        units={companyPickCardMock.singleUnit}
        index={0}
        onClick={vi.fn()}
      />
    )

    expect(
      screen.getByText(companyPickCardMock.companyName)
    ).toBeInTheDocument()
    expect(
      screen.getByText(companyPickCardMock.singleUnit[0].tenantName)
    ).toBeInTheDocument()
  })

  it('counts the units when the company has more than one', () => {
    render(
      <CompanyPickCard
        companyName={companyPickCardMock.companyName}
        units={companyPickCardMock.multipleUnits}
        index={0}
        onClick={vi.fn()}
      />
    )

    expect(
      screen.getByText(companyPickCardMock.unitCountLabel)
    ).toBeInTheDocument()
  })

  it('opens the company when chosen', async () => {
    const onClick = vi.fn()
    render(
      <CompanyPickCard
        companyName={companyPickCardMock.companyName}
        units={companyPickCardMock.singleUnit}
        index={companyPickCardMock.index}
        onClick={onClick}
      />
    )

    await userEvent.click(screen.getByText(companyPickCardMock.companyName))

    expect(onClick).toHaveBeenCalled()
  })
})
