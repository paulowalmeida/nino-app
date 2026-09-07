import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BrandAssetSlot } from './BrandAssetSlot'
import { brandAssetSlotMock } from './BrandAssetSlot.mock'

const chosen = new File(['art'], 'banner.png', { type: 'image/png' })
const edited = new File(['cut'], 'banner-cortado.png', { type: 'image/png' })

vi.mock('@shared/components/PhotoCropper/PhotoCropper', () => ({
  PhotoCropper: ({
    confirmLabel,
    onConfirm,
    onCancel,
  }: {
    confirmLabel: string
    onConfirm: (file: File) => void
    onCancel: () => void
  }) => (
    <div>
      <button onClick={() => onConfirm(edited)}>{confirmLabel}</button>
      <button onClick={onCancel}>desistir</button>
    </div>
  ),
}))

const chooseFile = async (container: HTMLElement) => {
  const input = container.querySelector('input[type="file"]')
  await userEvent.upload(input as HTMLInputElement, chosen)
}

describe(BrandAssetSlot.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts on the dropzone, with no cropper in the way', () => {
    render(<BrandAssetSlot {...brandAssetSlotMock} onCropped={vi.fn()} />)

    expect(screen.getByText('Escolher banner')).toBeInTheDocument()
    expect(screen.queryByText('Aproximar')).toBeNull()
  })

  it('names the field and what the file has to be', () => {
    render(<BrandAssetSlot {...brandAssetSlotMock} onCropped={vi.fn()} />)

    expect(screen.getByText('Banner')).toBeInTheDocument()
    expect(screen.getByText(brandAssetSlotMock.helperText)).toBeInTheDocument()
  })

  it('opens the framing once a file is chosen', async () => {
    const { container } = render(
      <BrandAssetSlot {...brandAssetSlotMock} onCropped={vi.fn()} />
    )

    await chooseFile(container)

    expect(
      await screen.findByText(brandAssetSlotMock.framingTitle)
    ).toBeInTheDocument()
  })

  it('hands over the framed file', async () => {
    const onCropped = vi.fn()
    const { container } = render(
      <BrandAssetSlot {...brandAssetSlotMock} onCropped={onCropped} />
    )

    await chooseFile(container)
    await userEvent.click(
      await screen.findByRole('button', {
        name: brandAssetSlotMock.confirmLabel,
      })
    )

    expect(onCropped).toHaveBeenCalledWith(edited)
    await waitFor(() =>
      expect(
        screen.queryByText(brandAssetSlotMock.framingTitle)
      ).not.toBeInTheDocument()
    )
  })

  it('keeps the file out when the framing is abandoned', async () => {
    const onCropped = vi.fn()
    const { container } = render(
      <BrandAssetSlot {...brandAssetSlotMock} onCropped={onCropped} />
    )

    await chooseFile(container)
    await userEvent.click(
      await screen.findByRole('button', { name: 'desistir' })
    )

    expect(onCropped).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(
        screen.queryByText(brandAssetSlotMock.framingTitle)
      ).not.toBeInTheDocument()
    )
  })
})
