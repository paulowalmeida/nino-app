import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionCommands } from '@shared/hooks/team/usePositionCommands/usePositionCommands'

import { usePositionDetailActions } from './usePositionDetailActions'
import { positionDetailActionsDraftMock } from './usePositionDetailActions.mock'

vi.mock('@shared/hooks/team/usePositionCommands/usePositionCommands')

const navigate = vi.fn()
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: () => navigate,
}))

const create = vi.fn()
const update = vi.fn()
const duplicate = vi.fn()
const remove = vi.fn()

describe(usePositionDetailActions.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    create.mockResolvedValue({})
    update.mockResolvedValue({})
    duplicate.mockResolvedValue({ id: 'copy-1' })
    remove.mockResolvedValue({})
    vi.mocked(usePositionCommands).mockReturnValue({
      create: { mutateAsync: create },
      update: { mutateAsync: update },
      duplicate: { mutateAsync: duplicate, isPending: true },
      remove: { mutateAsync: remove },
    } as never)
  })

  it('creates the cargo when the route carries no id, then goes back to the list', async () => {
    const { result } = renderHook(() =>
      usePositionDetailActions('unit-1', undefined)
    )

    await result.current.save(positionDetailActionsDraftMock)

    expect(create).toHaveBeenCalledWith(positionDetailActionsDraftMock)
    expect(update).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })

  it('updates the addressed cargo, then goes back to the list', async () => {
    const { result } = renderHook(() =>
      usePositionDetailActions('unit-1', 'position-1')
    )

    await result.current.save(positionDetailActionsDraftMock)

    expect(update).toHaveBeenCalledWith({
      positionId: 'position-1',
      draft: positionDetailActionsDraftMock,
    })
    expect(create).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })

  it('renames the addressed cargo without leaving the screen', async () => {
    const { result } = renderHook(() =>
      usePositionDetailActions('unit-1', 'position-1')
    )

    await result.current.rename('Cozinheiro')

    expect(update).toHaveBeenCalledWith({
      positionId: 'position-1',
      draft: { name: 'Cozinheiro' },
    })
    expect(navigate).not.toHaveBeenCalled()
  })

  it('opens the copy after duplicating', async () => {
    const { result } = renderHook(() =>
      usePositionDetailActions('unit-1', 'position-1')
    )

    await result.current.duplicate()

    expect(duplicate).toHaveBeenCalledWith('position-1')
    expect(navigate).toHaveBeenCalledWith('../copy-1', { relative: 'path' })
    expect(result.current.isDuplicating).toBe(true)
  })

  it('goes back to the list after removing', async () => {
    const { result } = renderHook(() =>
      usePositionDetailActions('unit-1', 'position-1')
    )

    await result.current.remove()

    expect(remove).toHaveBeenCalledWith('position-1')
    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })
})
