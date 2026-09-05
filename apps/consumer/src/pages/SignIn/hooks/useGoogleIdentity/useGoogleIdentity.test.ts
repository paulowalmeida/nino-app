import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useGoogleIdentity } from './useGoogleIdentity'
import { useGoogleIdentityMock } from './useGoogleIdentity.mock'

type GoogleWindow = Window & {
  google?: {
    accounts: {
      id: {
        initialize: ReturnType<typeof vi.fn>
        renderButton: ReturnType<typeof vi.fn>
        disableAutoSelect: ReturnType<typeof vi.fn>
      }
    }
  }
}

const googleWindow = window as GoogleWindow

const initialize = vi.fn()
const renderButton = vi.fn()

describe('useGoogleIdentity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', useGoogleIdentityMock.clientId)
    googleWindow.google = {
      accounts: {
        id: { initialize, renderButton, disableAutoSelect: vi.fn() },
      },
    }
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete googleWindow.google
  })

  it('renders the google button once the sdk is available', async () => {
    // Arrange
    const onCredential = vi.fn()

    // Act
    const { result } = renderHook(() => useGoogleIdentity(onCredential))
    Object.assign(result.current.containerRef, {
      current: document.createElement('div'),
    })

    // Assert
    await waitFor(() => expect(initialize).toHaveBeenCalled())
    expect(renderButton).toHaveBeenCalled()
  })

  it('hands the credential to the caller', async () => {
    // Arrange
    const onCredential = vi.fn()
    const { result } = renderHook(() => useGoogleIdentity(onCredential))
    Object.assign(result.current.containerRef, {
      current: document.createElement('div'),
    })

    // Act
    await waitFor(() => expect(initialize).toHaveBeenCalled())
    const [config] = initialize.mock.calls[0] as [
      { callback: (response: { credential?: string }) => void },
    ]
    config.callback({ credential: useGoogleIdentityMock.idToken })

    // Assert
    expect(onCredential).toHaveBeenCalledWith(useGoogleIdentityMock.idToken)
  })

  it('repaints the button when the column changes width', async () => {
    // Arrange
    const observe = vi.fn()
    let notify: (() => void) | undefined
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(cb: () => void) {
          notify = cb
        }
        observe = observe
        disconnect = vi.fn()
      }
    )
    const container = document.createElement('div')
    container.getBoundingClientRect = () =>
      ({ width: 300 }) as unknown as DOMRect

    const { result } = renderHook(() => useGoogleIdentity(vi.fn()))
    Object.assign(result.current.containerRef, { current: container })
    await waitFor(() => expect(renderButton).toHaveBeenCalled())

    // Act
    container.getBoundingClientRect = () =>
      ({ width: 240 }) as unknown as DOMRect
    notify?.()

    // Assert
    const widths = renderButton.mock.calls.map(([, options]) => options.width)
    expect(widths).toContain(240)
  })

  it('reports google as unavailable without a configured client id', () => {
    // Arrange
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '')

    // Act
    const { result } = renderHook(() => useGoogleIdentity(vi.fn()))

    // Assert
    expect(result.current.isConfigured).toBe(false)
    expect(initialize).not.toHaveBeenCalled()
  })
})
