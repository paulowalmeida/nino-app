import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppLayoutContent } from './AppLayoutContent'

describe('AppLayoutContent', () => {
  it('renders the active route through the outlet', () => {
    render(
      <MemoryRouter initialEntries={['/active']}>
        <Routes>
          <Route element={<AppLayoutContent collapsed={false} />} path="/">
            <Route element={<p>Conteúdo ativo</p>} path="active" />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Conteúdo ativo')).toBeInTheDocument()
  })
})
