import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RouteErrorBoundary } from '@components/RouteErrorBoundary/RouteErrorBoundary'

const routeError = vi.hoisted(() => vi.fn())
const isRouteErrorResponse = vi.hoisted(() => vi.fn())

vi.mock('react-router', () => ({
  useRouteError: routeError,
  isRouteErrorResponse,
}))

describe(RouteErrorBoundary.name, () => {
  const reload = vi.fn()

  beforeEach(() => {
    isRouteErrorResponse.mockReturnValue(false)
    vi.stubGlobal('location', { reload })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    sessionStorage.clear()
    reload.mockClear()
  })

  it('shows a crash message for a runtime error', () => {
    // Arrange
    routeError.mockReturnValue(new Error('boom'))

    // Act
    render(<RouteErrorBoundary />)

    // Assert
    expect(screen.getByText('Essa tela travou')).toBeInTheDocument()
  })

  it('shows a not-found message for a route error response', () => {
    // Arrange
    routeError.mockReturnValue({ status: 404 })
    isRouteErrorResponse.mockReturnValue(true)

    // Act
    render(<RouteErrorBoundary />)

    // Assert
    expect(screen.getByText('Essa página não existe')).toBeInTheDocument()
  })

  it('reloads the page when the button is clicked', async () => {
    // Arrange
    routeError.mockReturnValue(new Error('boom'))
    render(<RouteErrorBoundary />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Recarregar' }))

    // Assert
    expect(reload).toHaveBeenCalled()
  })

  it('reloads once without rendering a message for a stale chunk error', () => {
    // Arrange
    routeError.mockReturnValue(new Error('failed to fetch dynamically imported module'))

    // Act
    render(<RouteErrorBoundary />)

    // Assert
    expect(reload).toHaveBeenCalled()
    expect(screen.queryByText('Essa tela travou')).not.toBeInTheDocument()
  })

  it('does not reload again within the cooldown window', () => {
    // Arrange
    sessionStorage.setItem('nino-manager-chunk-reload-at', String(Date.now()))
    routeError.mockReturnValue(new Error('failed to fetch dynamically imported module'))

    // Act
    render(<RouteErrorBoundary />)

    // Assert
    expect(reload).not.toHaveBeenCalled()
  })
})
