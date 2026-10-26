import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useMenuImagesReady } from './useMenuImagesReady'
import { menuImagesReadySectionsMock } from './useMenuImagesReady.mock'

const preloads: Array<{
  source: string
  onload: (() => void) | null
}> = []

class PendingImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  complete = false
  naturalWidth = 0
  source = ''

  set src(source: string) {
    this.source = source
    preloads.push(this)
  }

  decode = () => Promise.resolve()
}

describe(useMenuImagesReady.name, () => {
  afterEach(() => {
    preloads.length = 0
    vi.unstubAllGlobals()
  })

  it('waits only for active menu item images', async () => {
    vi.stubGlobal('Image', PendingImage)
    const { result } = renderHook(() =>
      useMenuImagesReady(menuImagesReadySectionsMock)
    )

    expect(result.current.areMenuImagesReady).toBe(false)
    await waitFor(() => expect(preloads).toHaveLength(1))
    expect(preloads[0].source).toBe('/active-coxinha.png')

    preloads[0].onload?.()

    await waitFor(() => expect(result.current.areMenuImagesReady).toBe(true))
    expect(result.current.loadedSources).toEqual(
      new Set(['/active-coxinha.png'])
    )
  })
})
