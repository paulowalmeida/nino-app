import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitTheme } from '@pages/Units/hooks/useUnitTheme/useUnitTheme'
import { UnitThemeService } from '@pages/Units/services/unit-theme.service/unit-theme.service'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { UnitService } from '@shared/services/unit/unit.service'

import {
  themeEditorStateMock,
  themeUnitIdMock,
  unitDetailMock,
  unitDraftMock,
  uploadedUnitDetailMock,
} from './useUnitTheme.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => ({ unitId: 'unit-1' }),
}))
vi.mock('@pages/Units/services/unit-theme.service/unit-theme.service', () => ({
  UnitThemeService: {
    getEditorState: vi.fn(),
    saveDraft: vi.fn(),
    publishDraft: vi.fn(),
    restoreVersion: vi.fn(),
  },
}))
vi.mock('@shared/services/unit/unit.service', () => ({
  UnitService: { saveUnit: vi.fn() },
}))

const createHarness = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

describe(useUnitTheme.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(UnitThemeService.getEditorState).mockResolvedValue(
      themeEditorStateMock
    )
    vi.mocked(UnitThemeService.saveDraft).mockResolvedValue(
      themeEditorStateMock.published!
    )
    vi.mocked(UnitThemeService.publishDraft).mockResolvedValue(
      themeEditorStateMock.published!
    )
    vi.mocked(UnitThemeService.restoreVersion).mockResolvedValue(
      themeEditorStateMock.published!
    )
    vi.mocked(UnitService.saveUnit).mockResolvedValue(uploadedUnitDetailMock)
  })

  it('reads the editor state of the current unit', async () => {
    const { wrapper } = createHarness()

    const { result } = renderHook(() => useUnitTheme(), { wrapper })

    await waitFor(() => expect(result.current.editor.isSuccess).toBe(true))
    expect(UnitThemeService.getEditorState).toHaveBeenCalledWith(
      themeUnitIdMock
    )
    expect(result.current.editor.data).toEqual(themeEditorStateMock)
  })

  it('saves the draft without touching the unit assets', async () => {
    const { wrapper } = createHarness()
    const { result } = renderHook(() => useUnitTheme(), { wrapper })

    result.current.saveDraft.mutate({
      draft: unitDraftMock,
      unit: unitDetailMock,
    })

    await waitFor(() => expect(result.current.saveDraft.isSuccess).toBe(true))
    expect(UnitService.saveUnit).not.toHaveBeenCalled()
    expect(UnitThemeService.saveDraft).toHaveBeenCalledWith(
      themeUnitIdMock,
      expect.objectContaining({
        colors: expect.objectContaining({ primary: '#A8342A' }),
      })
    )
  })

  it('uploads a new logo before storing the document', async () => {
    const { wrapper } = createHarness()
    const { result } = renderHook(() => useUnitTheme(), { wrapper })

    result.current.saveDraft.mutate({
      draft: {
        ...unitDraftMock,
        logoFile: new File(['logo'], 'logo.png', { type: 'image/png' }),
      },
      unit: unitDetailMock,
    })

    await waitFor(() => expect(result.current.saveDraft.isSuccess).toBe(true))
    expect(UnitService.saveUnit).toHaveBeenCalled()
    expect(UnitThemeService.saveDraft).toHaveBeenCalledWith(
      themeUnitIdMock,
      expect.objectContaining({
        brand: expect.objectContaining({
          logoUrl: uploadedUnitDetailMock.logoUrl,
        }),
      })
    )
  })

  it('persists removing the saved assets before storing the document', async () => {
    const { wrapper } = createHarness()
    const { result } = renderHook(() => useUnitTheme(), { wrapper })

    result.current.saveDraft.mutate({
      draft: { ...unitDraftMock, logoUrl: null, bannerUrl: null },
      unit: unitDetailMock,
    })

    await waitFor(() => expect(result.current.saveDraft.isSuccess).toBe(true))
    expect(UnitService.saveUnit).toHaveBeenCalled()
    expect(UnitThemeService.saveDraft).toHaveBeenCalledWith(
      themeUnitIdMock,
      expect.objectContaining({
        brand: { logoUrl: null, faviconUrl: null, bannerUrl: null },
      })
    )
  })

  it('stores the draft before putting it on the storefront', async () => {
    const { wrapper } = createHarness()
    const { result } = renderHook(() => useUnitTheme(), { wrapper })

    result.current.publish.mutate({
      draft: unitDraftMock,
      unit: unitDetailMock,
    })

    await waitFor(() => expect(result.current.publish.isSuccess).toBe(true))
    expect(UnitThemeService.saveDraft).toHaveBeenCalled()
    expect(UnitThemeService.publishDraft).toHaveBeenCalledWith(themeUnitIdMock)
    const savedAt = vi.mocked(UnitThemeService.saveDraft).mock
      .invocationCallOrder[0]
    const publishedAt = vi.mocked(UnitThemeService.publishDraft).mock
      .invocationCallOrder[0]
    expect(savedAt).toBeLessThan(publishedAt)
  })

  it('does not publish when storing the draft fails', async () => {
    vi.mocked(UnitThemeService.saveDraft).mockRejectedValue(
      new Error('offline')
    )
    const { wrapper } = createHarness()
    const { result } = renderHook(() => useUnitTheme(), { wrapper })

    result.current.publish.mutate({
      draft: unitDraftMock,
      unit: unitDetailMock,
    })

    await waitFor(() => expect(result.current.publish.isError).toBe(true))
    expect(UnitThemeService.publishDraft).not.toHaveBeenCalled()
  })

  it('refreshes the editor after restoring a version', async () => {
    const { queryClient, wrapper } = createHarness()
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUnitTheme(), { wrapper })

    result.current.restore.mutate(1)

    await waitFor(() => expect(result.current.restore.isSuccess).toBe(true))
    expect(UnitThemeService.restoreVersion).toHaveBeenCalledWith(
      themeUnitIdMock,
      1
    )
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: queryKeys.unit.theme(themeUnitIdMock),
    })
  })
})
