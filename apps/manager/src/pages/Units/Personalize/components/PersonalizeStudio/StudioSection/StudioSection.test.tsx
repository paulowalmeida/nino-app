import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StudioSection } from './StudioSection'
import { studioSectionMock } from './StudioSection.mock'

describe(StudioSection.name, () => {
  it('opens with its content in the open, under a named region', () => {
    render(
      <StudioSection {...studioSectionMock}>
        <p>Conteúdo da seção</p>
      </StudioSection>
    )

    expect(screen.getByRole('region', { name: 'Cores' })).toBeInTheDocument()
    expect(screen.getByText(studioSectionMock.description)).toBeVisible()
    expect(screen.getByText('Conteúdo da seção')).toBeVisible()
  })

  it('keeps the single configuration visible without a collapsible wrapper', () => {
    render(
      <StudioSection {...studioSectionMock}>
        <p>Conteúdo da seção</p>
      </StudioSection>
    )

    expect(screen.queryByRole('button', { name: /Cores/ })).toBeNull()
    expect(screen.getByText('Conteúdo da seção')).toBeVisible()
  })
})
