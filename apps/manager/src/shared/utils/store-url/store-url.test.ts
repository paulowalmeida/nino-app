import { describe, expect, it } from 'vitest'

import { storeUrlFor } from './store-url'
import { storeUrlMock } from './store-url.mock'

describe('storeUrlFor', () => {
  it('points to the published subdomain when the manager is deployed', () => {
    // Arrange
    const { slug, publishedHostname, publishedUrl } = storeUrlMock

    // Act
    const url = storeUrlFor(slug, publishedHostname)

    // Assert
    expect(url).toBe(publishedUrl)
  })

  it('points to the local path mode when the manager runs locally', () => {
    // Arrange
    const { slug, localHostname, localUrl } = storeUrlMock

    // Act
    const url = storeUrlFor(slug, localHostname)

    // Assert
    expect(url).toBe(localUrl)
  })

  it('treats a localhost subdomain as local too', () => {
    // Arrange
    const { slug, localUrl } = storeUrlMock

    // Act
    const url = storeUrlFor(slug, 'gestor.localhost')

    // Assert
    expect(url).toBe(localUrl)
  })
})
