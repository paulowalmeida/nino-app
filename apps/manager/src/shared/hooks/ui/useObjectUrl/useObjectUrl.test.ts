import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useObjectUrl } from './useObjectUrl'
import { objectUrlMock } from './useObjectUrl.mock'

const createObjectURL = vi.fn()
const revokeObjectURL = vi.fn()

describe('useObjectUrl', () => {
  beforeEach(() => {
    createObjectURL
      .mockReturnValueOnce(objectUrlMock.firstUrl)
      .mockReturnValueOnce(objectUrlMock.secondUrl)
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('gives no URL when there is no file', () => {
    const { result } = renderHook(() => useObjectUrl(undefined))

    expect(result.current).toBeUndefined()
    expect(createObjectURL).not.toHaveBeenCalled()
  })

  it('creates the URL for the file and revokes it when released', () => {
    const file = new File(['a'], objectUrlMock.firstFileName)
    const { result, unmount } = renderHook(() => useObjectUrl(file))

    expect(result.current).toBe(objectUrlMock.firstUrl)

    unmount()

    expect(revokeObjectURL).toHaveBeenCalledWith(objectUrlMock.firstUrl)
  })

  it('shares one URL between consumers of the same file and revokes after the last', () => {
    const file = new File(['a'], objectUrlMock.firstFileName)
    const first = renderHook(() => useObjectUrl(file))
    const second = renderHook(() => useObjectUrl(file))

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(second.result.current).toBe(first.result.current)

    first.unmount()
    expect(revokeObjectURL).not.toHaveBeenCalled()

    second.unmount()
    expect(revokeObjectURL).toHaveBeenCalledTimes(1)
  })

  it('swaps the URL when the file changes', () => {
    const logo = new File(['a'], objectUrlMock.firstFileName)
    const banner = new File(['b'], objectUrlMock.secondFileName)
    const { result, rerender } = renderHook(({ file }) => useObjectUrl(file), {
      initialProps: { file: logo },
    })

    rerender({ file: banner })

    expect(result.current).toBe(objectUrlMock.secondUrl)
    expect(revokeObjectURL).toHaveBeenCalledWith(objectUrlMock.firstUrl)
  })
})
