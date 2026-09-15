import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Breadcrumb } from './Breadcrumb'
import { breadcrumbMock } from './Breadcrumb.mock'

describe(Breadcrumb.name, () => {
  it('renders navigable ancestors and the current page', () => {
    render(
      <MemoryRouter initialEntries={['/settings/profile']}>
        <Breadcrumb {...breadcrumbMock} />
      </MemoryRouter>
    )
    expect(screen.getByText('Configurações')).toBeInTheDocument()
    expect(screen.getByText('Perfil')).toBeInTheDocument()
  })
})
