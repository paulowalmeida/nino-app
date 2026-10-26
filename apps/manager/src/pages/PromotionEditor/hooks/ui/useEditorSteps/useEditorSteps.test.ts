import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useEditorSteps } from './useEditorSteps'
import { editorStepsMock } from './useEditorSteps.mock'

describe(useEditorSteps.name, () => {
  it('advances only when the current step is valid', async () => {
    const trigger = vi.fn().mockResolvedValueOnce(false).mockResolvedValue(true)
    const { result } = renderHook(() =>
      useEditorSteps('create', trigger, 'free-delivery')
    )

    await act(() => result.current.goNext())
    expect(result.current.step).toBe(0)
    expect(trigger).toHaveBeenCalledWith(
      [
        'name',
        'minOrderValue',
        'discountValue',
        'maxDiscount',
        'giftProductId',
        'packagePrice',
        'packageGroups',
      ],
      { shouldFocus: true }
    )

    await act(() => result.current.goNext())
    expect(result.current.stepKey).toBe('zones')
  })

  it('skips the zones step for a discount', () => {
    const { result } = renderHook(() =>
      useEditorSteps('create', vi.fn(), 'discount')
    )

    expect(result.current.steps.map(({ title }) => title)).toEqual([
      'Benefício',
      'Quando vale',
      'Regras',
    ])
  })

  it('does not jump ahead to a step not reached yet when creating', () => {
    const { result } = renderHook(() =>
      useEditorSteps('create', vi.fn(), 'free-delivery')
    )

    act(() => result.current.goTo(2))

    expect(result.current.step).toBe(0)
  })

  it('opens any step directly when editing', () => {
    const { result } = renderHook(() =>
      useEditorSteps('edit', vi.fn(), 'free-delivery')
    )

    act(() => result.current.goTo(editorStepsMock.lastStep))

    expect(result.current.isLastStep).toBe(true)
    act(() => result.current.goBack())
    expect(result.current.step).toBe(editorStepsMock.lastStep - 1)
  })
})
