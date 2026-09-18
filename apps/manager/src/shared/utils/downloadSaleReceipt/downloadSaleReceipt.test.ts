import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { downloadSaleReceipt } from './downloadSaleReceipt'
import {
  receiptBlobMock,
  receiptFilenameMock,
} from './downloadSaleReceipt.mock'

describe(downloadSaleReceipt.name, () => {
  const createObjectURL = vi.fn(() => 'blob:receipt-url')
  const revokeObjectURL = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('triggers a browser download named after the receipt file', () => {
    // Arrange
    const anchorClick = vi.fn()
    const anchor = { click: anchorClick, href: '', download: '' }
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(anchor as unknown as HTMLAnchorElement)
    const appendSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node) => node)
    const removeSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation((node) => node)

    // Act
    downloadSaleReceipt(receiptBlobMock, receiptFilenameMock)

    // Assert
    expect(createObjectURL).toHaveBeenCalledWith(receiptBlobMock)
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(anchor.href).toBe('blob:receipt-url')
    expect(anchor.download).toBe(receiptFilenameMock)
    expect(anchorClick).toHaveBeenCalledTimes(1)
    expect(appendSpy).toHaveBeenCalledWith(anchor)
    expect(removeSpy).toHaveBeenCalledWith(anchor)
  })

  it('releases the object URL after triggering the download', () => {
    // Arrange
    const anchor = { click: vi.fn(), href: '', download: '' }
    vi.spyOn(document, 'createElement').mockReturnValue(
      anchor as unknown as HTMLAnchorElement
    )
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)

    // Act
    downloadSaleReceipt(receiptBlobMock, receiptFilenameMock)

    // Assert
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:receipt-url')
  })
})
