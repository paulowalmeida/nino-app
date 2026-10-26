import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppLayoutContent } from './AppLayoutContent'
import { appLayoutContentMock } from './AppLayoutContent.mock'

describe('AppLayoutContent', () => {
  it('renders the active route through the outlet', () => {
    const { routePath, routeContent } = appLayoutContentMock

    render(
      <MemoryRouter initialEntries={[`/${routePath}`]}>
        <Routes>
          <Route element={<AppLayoutContent />} path="/">
            <Route element={<p>{routeContent}</p>} path={routePath} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(routeContent)).toBeInTheDocument()
  })
})
