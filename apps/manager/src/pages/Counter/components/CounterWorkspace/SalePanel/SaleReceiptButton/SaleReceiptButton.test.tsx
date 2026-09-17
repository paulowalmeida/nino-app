import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SaleReceiptButton } from './SaleReceiptButton'
import { saleReceiptButtonMock } from './SaleReceiptButton.mock'

describe(SaleReceiptButton.name, () => {
  it('displays the pickup code returned by the server', () => {
    render(
      <SaleReceiptButton
        {...saleReceiptButtonMock}
        saleReceipt={{
          ...saleReceiptButtonMock.saleReceipt!,
          pickupCode: '012345',
        }}
        onDownload={vi.fn()}
        onDismiss={vi.fn()}
      />
    )
    expect(screen.getByText(/Código de retirada: 012345/)).toBeInTheDocument()
  })

  it('announces the sale that just closed', () => {
    render(
      <SaleReceiptButton
        {...saleReceiptButtonMock}
        onDownload={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    expect(screen.getByText('Venda #128 fechada')).toBeInTheDocument()
  })

  it('downloads the receipt for that sale when clicked', async () => {
    // Arrange
    const onDownload = vi.fn()
    render(
      <SaleReceiptButton
        {...saleReceiptButtonMock}
        onDownload={onDownload}
        onDismiss={vi.fn()}
      />
    )

    // Act
    await userEvent.click(screen.getByRole('button', { name: /Gerar recibo/ }))

    // Assert
    expect(onDownload).toHaveBeenCalledWith(saleReceiptButtonMock.saleReceipt)
  })

  it('disables the download button while the PDF is being fetched', () => {
    render(
      <SaleReceiptButton
        {...saleReceiptButtonMock}
        isDownloading
        onDownload={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    expect(screen.getAllByRole('button')[0]).toBeDisabled()
  })

  it('dismisses the receipt when the x is pressed', async () => {
    // Arrange
    const onDismiss = vi.fn()
    render(
      <SaleReceiptButton
        {...saleReceiptButtonMock}
        onDownload={vi.fn()}
        onDismiss={onDismiss}
      />
    )

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Dispensar recibo' })
    )

    // Assert
    expect(onDismiss).toHaveBeenCalled()
  })

  it('renders nothing without a closed sale', () => {
    const { container } = render(
      <SaleReceiptButton
        saleReceipt={null}
        isDownloading={false}
        onDownload={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
