import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { downloadSaleReceipt } from '@pages/Counter/utils/downloadSaleReceipt/downloadSaleReceipt'

import { SaleReceiptButton } from './SaleReceiptButton'
import { saleReceiptButtonMock } from './SaleReceiptButton.mock'

vi.mock('@pages/Counter/utils/downloadSaleReceipt/downloadSaleReceipt')

describe(SaleReceiptButton.name, () => {
  it('displays the pickup code returned by the server', () => {
    render(
      <SaleReceiptButton
        saleReceipt={{
          ...saleReceiptButtonMock.saleReceipt!,
          pickupCode: '012345',
        }}
        onDismiss={vi.fn()}
      />
    )
    expect(screen.getByText(/Código de retirada: 012345/)).toBeInTheDocument()
  })
  it('announces the sale that just closed', () => {
    render(<SaleReceiptButton {...saleReceiptButtonMock} onDismiss={vi.fn()} />)

    expect(screen.getByText('Venda #128 fechada')).toBeInTheDocument()
  })

  it('downloads the PDF for that sale when clicked', async () => {
    // Arrange
    render(<SaleReceiptButton {...saleReceiptButtonMock} onDismiss={vi.fn()} />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: /Gerar recibo/ }))

    // Assert
    expect(downloadSaleReceipt).toHaveBeenCalledWith(
      saleReceiptButtonMock.saleReceipt
    )
  })

  it('dismisses the receipt when the x is pressed', async () => {
    // Arrange
    const onDismiss = vi.fn()
    render(
      <SaleReceiptButton {...saleReceiptButtonMock} onDismiss={onDismiss} />
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
      <SaleReceiptButton saleReceipt={null} onDismiss={vi.fn()} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
