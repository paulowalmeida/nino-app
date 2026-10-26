import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RouteErrorBoundary } from './RouteErrorBoundary'
import { routeErrorMock } from './RouteErrorBoundary.mock'

vi.mock('react-router', () => ({
  isRouteErrorResponse: () => false,
  useRouteError: () => routeErrorMock,
}))

describe(RouteErrorBoundary.name, () => {
  it('shows a recoverable error state', () => {
    render(<RouteErrorBoundary />)
    expect(screen.getByRole('heading', { name: 'Essa tela travou' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recarregar' })).toBeInTheDocument()
  })
})
