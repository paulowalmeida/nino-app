import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BackLink } from './BackLink'
import { backLinkMock } from './BackLink.mock'

describe(BackLink.name, () => {
  it('exposes the relative navigation target as a link', () => {
    render(
      <MemoryRouter initialEntries={['/settings/profile']}>
        <BackLink {...backLinkMock} />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: backLinkMock.children })).toHaveAttribute(
      'href',
      backLinkMock.to
    )
  })
})
