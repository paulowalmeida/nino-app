import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RegisterLayout } from './RegisterLayout'
import { registerLayoutMock } from './RegisterLayout.mock'

describe('RegisterLayout', () => {
  it('renders the registration outlet and a link back to sign in', () => {
    render(
      <MemoryRouter initialEntries={[`/${registerLayoutMock.routePath}`]}>
        <Routes>
          <Route element={<RegisterLayout />} path="/">
            <Route
              element={<p>{registerLayoutMock.routeContent}</p>}
              path={registerLayoutMock.routePath}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('main')).toContainElement(
      screen.getByText(registerLayoutMock.routeContent)
    )
    expect(screen.getByRole('link', { name: 'Sair' })).toHaveAttribute(
      'href',
      '/entrar'
    )
  })
})
