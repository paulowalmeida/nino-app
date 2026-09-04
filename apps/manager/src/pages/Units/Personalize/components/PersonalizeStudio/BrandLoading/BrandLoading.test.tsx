import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { BrandLoading } from './BrandLoading'
import { brandLoadingMock } from './BrandLoading.mock'

describe(BrandLoading.name, () => {
  it('offers the three loading styles with the current one selected', () => {
    render(<BrandLoading {...brandLoadingMock} onValueChange={vi.fn()} />)

    expect(screen.getByRole('radio', { name: /Nino/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Spinner/ })).not.toBeChecked()
  })

  it('reports the chosen loading style', async () => {
    const onValueChange = vi.fn()
    render(<BrandLoading {...brandLoadingMock} onValueChange={onValueChange} />)

    await userEvent.click(screen.getByLabelText('Pontos'))

    expect(onValueChange).toHaveBeenCalledWith('DOTS')
  })
})
