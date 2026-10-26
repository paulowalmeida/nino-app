import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { lookupZipCode } from '@nino/lib/services/zip-code.service'

import { useAddressLookup } from './useAddressLookup'
import { useAddressLookupMock } from './useAddressLookup.mock'

vi.mock('@nino/lib/services/zip-code.service')

let mutationFn: ((zipCode: string) => unknown) | undefined

vi.mock('@tanstack/react-query', () => ({
  useMutation: (options: { mutationFn: typeof mutationFn }) => {
    mutationFn = options.mutationFn
    return { mutate: vi.fn() }
  },
}))

describe('useAddressLookup', () => {
  it('looks up the supplied zip code through the shared service', () => {
    renderHook(() => useAddressLookup())

    mutationFn?.(useAddressLookupMock.zipCode)

    expect(lookupZipCode).toHaveBeenCalledWith(useAddressLookupMock.zipCode)
  })
})
