import { beforeEach, describe, expect, it } from 'vitest'

import { useSignInStore } from './sign-in.store'
import { signInStoreMock } from './sign-in.store.mock'

describe('useSignInStore', () => {
  beforeEach(() => {
    useSignInStore.setState({
      step: 'method',
      channel: 'phone',
      phone: '',
      email: '',
      code: '',
      name: '',
    })
  })

  it('coordinates the identify-form draft fields', () => {
    const store = useSignInStore.getState()

    store.setChannel(signInStoreMock.channel)
    store.setPhone(signInStoreMock.phone)
    store.setEmail(signInStoreMock.email)

    expect(useSignInStore.getState()).toMatchObject({
      channel: signInStoreMock.channel,
      phone: signInStoreMock.phone,
      email: signInStoreMock.email,
    })
  })

  it('advances to the code step and back, clearing the code draft', () => {
    const store = useSignInStore.getState()

    store.setCode(signInStoreMock.code)
    store.goToCode()
    expect(useSignInStore.getState()).toMatchObject({
      step: 'code',
      code: signInStoreMock.code,
    })

    useSignInStore.getState().goToMethods()
    expect(useSignInStore.getState()).toMatchObject({
      step: 'method',
      phone: '',
      email: '',
      code: '',
    })
  })

  it('resets a previous login attempt to the initial state', () => {
    useSignInStore.setState({
      step: 'code',
      channel: 'email',
      phone: signInStoreMock.phone,
      email: signInStoreMock.email,
      code: signInStoreMock.code,
    })

    useSignInStore.getState().reset()

    expect(useSignInStore.getState()).toMatchObject({
      step: 'method',
      channel: 'phone',
      phone: '',
      email: '',
      code: '',
    })
  })
})
