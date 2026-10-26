import { describe, expect, it } from 'vitest'

import { resolveLocalStoreRedirect } from './local-store-redirect'
import { localStoreRedirectMock } from './local-store-redirect.mock'

describe('resolveLocalStoreRedirect', () => {
  it('moves a local store subdomain to the path mode', () => {
    // Arrange
    const { storeSubdomain, pathMode } = localStoreRedirectMock

    // Act
    const redirect = resolveLocalStoreRedirect(storeSubdomain)

    // Assert
    expect(redirect).toBe(pathMode)
  })

  it('keeps the query string and the hash', () => {
    // Arrange
    const href = 'http://burgao-centro.localhost:3002/entrar?mesa=4#topo'

    // Act
    const redirect = resolveLocalStoreRedirect(href)

    // Assert
    expect(redirect).toBe(
      'http://localhost:3002/burgao-centro/entrar?mesa=4#topo'
    )
  })

  it('drops the lone slash of the store root', () => {
    // Arrange
    const { storeSubdomainRoot } = localStoreRedirectMock

    // Act
    const redirect = resolveLocalStoreRedirect(storeSubdomainRoot)

    // Assert
    expect(redirect).toBe('http://localhost:3002/burgao-centro')
  })

  it('leaves the bare localhost alone', () => {
    expect(
      resolveLocalStoreRedirect('http://localhost:3002/burgao-centro')
    ).toBeNull()
  })

  it('never touches a published store', () => {
    const { published } = localStoreRedirectMock

    expect(resolveLocalStoreRedirect(published)).toBeNull()
  })

  it('ignores a host with more than one label before localhost', () => {
    expect(
      resolveLocalStoreRedirect('http://a.b.localhost:3002/entrar')
    ).toBeNull()
  })
})
