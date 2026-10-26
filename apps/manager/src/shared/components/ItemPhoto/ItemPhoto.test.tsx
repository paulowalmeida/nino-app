import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ItemPhoto } from './ItemPhoto'
import { itemPhotoMock } from './ItemPhoto.mock'

describe(ItemPhoto.name, () => {
  it('renders the empty upload state', () => {
    render(<ItemPhoto {...itemPhotoMock} />)
    expect(screen.getByText('Arraste uma foto aqui')).toBeInTheDocument()
    expect(screen.getByLabelText('Escolher arquivo')).toBeInTheDocument()
  })
})
