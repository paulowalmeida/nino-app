import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { toast } from '@nino/ds/components/Toast'
import { useCreateProduct } from '@pages/NewProduct/hooks/useCreateProduct/useCreateProduct'

import { useNewProductSubmission } from './useNewProductSubmission'
import {
  createdProductMock,
  createdWithoutPhotoMock,
  newProductValuesMock,
} from './useNewProductSubmission.mock'

const navigate = vi.fn()

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}))
vi.mock('@nino/ds/components/Toast', () => ({
  toast: { warning: vi.fn() },
}))
vi.mock('@pages/NewProduct/hooks/useCreateProduct/useCreateProduct')

const mutateAsync = vi.fn()

const renderSubmission = () =>
  renderHook(() => useNewProductSubmission('tenant-1'), {
    wrapper: MemoryRouter,
  })

describe('useNewProductSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCreateProduct).mockReturnValue({
      mutateAsync,
    } as unknown as ReturnType<typeof useCreateProduct>)
  })

  it('creates the item and goes back to the menu', async () => {
    mutateAsync.mockResolvedValue(createdProductMock)
    const photo = new File([''], 'photo.png')
    const { result } = renderSubmission()

    let succeeded = false
    await act(async () => {
      succeeded = await result.current.submitProduct(
        newProductValuesMock,
        photo
      )
    })

    expect(succeeded).toBe(true)
    expect(mutateAsync).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: 'X-Tudo', price: 24.9 }),
      image: photo,
    })
    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
    expect(toast.warning).not.toHaveBeenCalled()
  })

  it('warns that the item exists but its photo did not go up', async () => {
    mutateAsync.mockResolvedValue(createdWithoutPhotoMock)
    const { result } = renderSubmission()

    await act(async () => {
      await result.current.submitProduct(newProductValuesMock, null)
    })

    expect(toast.warning).toHaveBeenCalledWith(
      'Item criado, mas a foto não subiu',
      'Abra o item no cardápio e envie a foto de novo.'
    )
    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })

  it('keeps the attendant on the form when creation fails', async () => {
    mutateAsync.mockRejectedValue(new Error('offline'))
    const { result } = renderSubmission()

    let succeeded = true
    await act(async () => {
      succeeded = await result.current.submitProduct(newProductValuesMock, null)
    })

    expect(succeeded).toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('leaves the form behind when the attendant gives up', () => {
    const { result } = renderSubmission()

    act(() => result.current.cancel())

    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })
})
