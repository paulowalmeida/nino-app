import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'
import { useSignInBrand } from '@pages/sign-in/hooks/useSignInBrand/useSignInBrand'
import { useSignInMutations } from '@pages/sign-in/hooks/useSignInMutations/useSignInMutations'
import { useSignInStore } from '@pages/sign-in/states/sign-in/sign-in.store'

import { useSignInFacade } from './useSignInFacade'
import { useSignInFacadeMock } from './useSignInFacade.mock'

vi.mock('@pages/sign-in/hooks/useSignInBrand/useSignInBrand')
vi.mock('@pages/sign-in/hooks/useSignInMutations/useSignInMutations')
vi.mock('@pages/sign-in/states/sign-in/sign-in.store')
vi.mock('@shared/hooks/useConsumerSession/useConsumerSession')

describe('useSignInFacade', () => {
  it('exposes the brand, client-state fields, and mutation commands', () => {
    // Arrange
    const requestCode = vi.fn()
    const verifyCode = vi.fn()
    const setChannel = vi.fn()
    const goToCode = vi.fn()
    const goToIdentify = vi.fn()
    const goToCompleteProfile = vi.fn()

    vi.mocked(useSignInBrand).mockReturnValue({
      home: useSignInFacadeMock.home,
      store: useSignInFacadeMock.store,
    } as unknown as ReturnType<typeof useSignInBrand>)

    vi.mocked(useConsumerSession).mockReturnValue({
      consumer: useSignInFacadeMock.consumer,
      isPending: false,
    } as unknown as ReturnType<typeof useConsumerSession>)

    vi.mocked(useSignInStore).mockReturnValue({
      step: useSignInFacadeMock.step,
      channel: useSignInFacadeMock.channel,
      setChannel,
      phone: useSignInFacadeMock.phone,
      setPhone: vi.fn(),
      email: useSignInFacadeMock.email,
      setEmail: vi.fn(),
      code: useSignInFacadeMock.code,
      setCode: vi.fn(),
      name: useSignInFacadeMock.name,
      setName: vi.fn(),
      goToCode,
      goToIdentify,
      goToMethods: vi.fn(),
      goToCompleteProfile,
      goToCompletePhoneCode: vi.fn(),
    } as unknown as ReturnType<typeof useSignInStore>)

    vi.mocked(useSignInMutations).mockReturnValue({
      requestCode,
      isRequesting: false,
      requestFailed: false,
      verifyCode,
      isVerifying: false,
      verifyFailed: false,
      googleFailed: false,
      requestPhoneCode: vi.fn(),
      isRequestingPhoneCode: false,
      requestPhoneCodeFailed: false,
      verifyPhoneCode: vi.fn(),
      isVerifyingPhoneCode: false,
      verifyPhoneCodeFailed: false,
      finishProfile: vi.fn(),
      isFinishingProfile: false,
      finishProfileFailed: false,
      skipPhone: vi.fn(),
    } as unknown as ReturnType<typeof useSignInMutations>)

    // Act
    const { result } = renderHook(() => useSignInFacade())

    // Assert
    expect(useSignInMutations).toHaveBeenCalledWith(
      useSignInFacadeMock.home,
      {
        onCodeRequested: goToCode,
        goToCompleteProfile,
        onPhoneCodeRequested: expect.any(Function),
      },
      useSignInFacadeMock.consumer
    )
    expect(result.current.home).toBe(useSignInFacadeMock.home)
    expect(result.current.store).toBe(useSignInFacadeMock.store)
    expect(result.current.consumer).toBe(useSignInFacadeMock.consumer)
    expect(result.current.step).toBe(useSignInFacadeMock.step)
    expect(result.current.channel).toBe(useSignInFacadeMock.channel)
    expect(result.current.setChannel).toBe(setChannel)
    expect(result.current.requestCode).toBe(requestCode)
    expect(result.current.verifyCode).toBe(verifyCode)
    expect(result.current.goToIdentify).toBe(goToIdentify)
  })
})
