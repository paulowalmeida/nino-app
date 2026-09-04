import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StorefrontPreview } from './StorefrontPreview'
import { storefrontPreviewMock } from './StorefrontPreview.mock'

describe(StorefrontPreview.name, () => {
  it('shows the store identity and a representative menu', () => {
    render(
      <StorefrontPreview {...storefrontPreviewMock} onDeviceChange={vi.fn()} />
    )

    expect(
      screen.getByRole('region', { name: 'Prévia da loja para o cliente' })
    ).toBeInTheDocument()
    expect(screen.getByText('Unidade Centro')).toBeInTheDocument()
    expect(screen.getByText('Especial da casa')).toBeInTheDocument()
  })

  it('falls back to a placeholder name while the unit has none', () => {
    render(
      <StorefrontPreview
        {...storefrontPreviewMock}
        storeName="  "
        onDeviceChange={vi.fn()}
      />
    )

    expect(screen.getByText('Nome da unidade')).toBeInTheDocument()
  })

  it('marks the device format it is currently showing', () => {
    render(
      <StorefrontPreview
        {...storefrontPreviewMock}
        device="desktop"
        onDeviceChange={vi.fn()}
      />
    )

    expect(screen.getByRole('tab', { name: 'Computador' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'Celular' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
  })

  it('asks for the other device format when the tab is chosen', () => {
    const onDeviceChange = vi.fn()
    render(
      <StorefrontPreview
        {...storefrontPreviewMock}
        onDeviceChange={onDeviceChange}
      />
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Computador' }))

    expect(onDeviceChange).toHaveBeenCalledWith('desktop')
  })
})
