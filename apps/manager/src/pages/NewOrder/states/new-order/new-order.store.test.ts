import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useNewOrderStore } from './new-order.store'
import { storeDraftMock, storeLineMock } from './new-order.store.mock'

describe('useNewOrderStore', () => {
  beforeEach(() => act(() => useNewOrderStore.getState().reset()))

  it('opens as an empty counter ticket', () => {
    const draft = useNewOrderStore.getState()

    expect(draft.lines).toEqual([])
    expect(draft.channel).toBe('COUNTER')
    expect(draft.chosenMethod).toBeNull()
    expect(draft.notes).toBe('')
  })

  it('adds and steps a line through its operations', () => {
    act(() => useNewOrderStore.getState().add(storeLineMock))
    act(() => useNewOrderStore.getState().add(storeLineMock))
    expect(useNewOrderStore.getState().lines[0].quantity).toBe(2)

    act(() => useNewOrderStore.getState().step(storeLineMock.productId, -1))
    expect(useNewOrderStore.getState().lines[0].quantity).toBe(1)
  })

  it('keeps channel, payment, recipient, and notes the attendant chose', () => {
    act(() => {
      useNewOrderStore.getState().setChannel('DELIVERY')
      useNewOrderStore.getState().setChosenMethod('PIX')
      useNewOrderStore
        .getState()
        .setRecipient({ name: storeDraftMock.recipientName })
      useNewOrderStore.getState().setNotes(storeDraftMock.notes)
    })

    const draft = useNewOrderStore.getState()
    expect(draft.channel).toBe('DELIVERY')
    expect(draft.chosenMethod).toBe('PIX')
    expect(draft.recipient.name).toBe(storeDraftMock.recipientName)
    expect(draft.notes).toBe(storeDraftMock.notes)
  })

  it('clears everything when the screen opens again', () => {
    act(() => {
      useNewOrderStore.getState().add(storeLineMock)
      useNewOrderStore.getState().setChannel('DELIVERY')
      useNewOrderStore.getState().setNotes(storeDraftMock.notes)
    })

    act(() => useNewOrderStore.getState().reset())

    const draft = useNewOrderStore.getState()
    expect(draft.lines).toEqual([])
    expect(draft.channel).toBe('COUNTER')
    expect(draft.notes).toBe('')
  })
})
