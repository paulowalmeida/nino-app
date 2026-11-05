import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { RouteErrorBoundary } from './RouteErrorBoundary'
import { routeErrorBoundaryMock } from './RouteErrorBoundary.mock'

const BrokenScreen = () => {
  throw new Error('render crashed')
}

const renderAt = (path: string) =>
  render(
    <RouterProvider
      router={createMemoryRouter(
        [
          {
            path: ':slug',
            errorElement: <RouteErrorBoundary />,
            children: [
              { index: true, element: <p>cardápio</p> },
              { path: 'quebrada', element: <BrokenScreen /> },
            ],
          },
        ],
        { initialEntries: [path] }
      )}
    />
  )

describe('RouteErrorBoundary', () => {
  it('tells a missing page apart and leads back to the store', () => {
    renderAt(routeErrorBoundaryMock.missingPath)

    expect(screen.getByText('Essa página não existe')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para a loja' })
    ).toHaveAttribute('href', `/${routeErrorBoundaryMock.slug}`)
    expect(screen.queryByText(/Hey developer/)).toBeNull()
  })

  it('shows a friendly failure instead of the developer screen', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderAt(`/${routeErrorBoundaryMock.slug}/quebrada`)

    expect(screen.getByText('Algo deu errado aqui')).toBeInTheDocument()
    expect(screen.queryByText(/Unexpected Application Error/)).toBeNull()
  })
})
