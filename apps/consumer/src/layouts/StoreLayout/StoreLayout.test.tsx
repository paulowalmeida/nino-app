import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useStoreTint } from '@shared/hooks/useStoreTint/useStoreTint'
import { StoreLayout } from './StoreLayout'
import { storeLayoutMock } from './StoreLayout.mock'

vi.mock('@shared/hooks/useStoreTint/useStoreTint')

describe('StoreLayout', () => {
  it('provides the store tint and renders its route outlet', () => {
    vi.mocked(useStoreTint).mockReturnValue(storeLayoutMock.tint)

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route index element={<p>Conteúdo da loja</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Conteúdo da loja').parentElement).toHaveStyle({
      '--store-tint': storeLayoutMock.tint,
    })
  })
})
