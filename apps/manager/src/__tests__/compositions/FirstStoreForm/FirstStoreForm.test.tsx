import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FirstStoreForm } from '@compositions/FirstStoreForm/FirstStoreForm'
import type { FirstStoreFormValues } from '@custom_types/store/first-store-form-values'
import { ApiError } from '@nino/lib/utils/api-error'

import { storeTypes } from './FirstStoreForm.mock'

const createStoreMutateAsync = vi.fn()

vi.mock('@hooks/store/useStoreTypes', () => ({
  useStoreTypes: () => ({ data: storeTypes }),
}))

vi.mock('@hooks/store/useCreateStore', () => ({
  useCreateStore: () => ({ mutateAsync: createStoreMutateAsync }),
}))

/* Detail/address fields have their own inputs and validation — what's
 * under test here is the form's own concern: draft restore/persist and
 * how submit success/error is handled. */
vi.mock(
  '@compositions/StoreFormDetailsFields/StoreFormDetailsFields',
  () => ({
    StoreFormDetailsFields: ({
      errors,
      register,
    }: {
      errors: { slug?: { message?: string } }
      register: (name: keyof FirstStoreFormValues) => object
    }) => (
      <div>
        <input aria-label="nome fantasia" {...register('customName')} />
        <input aria-label="endereço" {...register('slug')} />
        <input type="hidden" {...register('typeId')} />
        {errors.slug && <p>{errors.slug.message}</p>}
      </div>
    ),
  })
)

vi.mock(
  '@compositions/StoreFormAddressFields/StoreFormAddressFields',
  () => ({
    StoreFormAddressFields: ({
      register,
    }: {
      register: (name: keyof FirstStoreFormValues) => object
    }) => (
      <div>
        <input type="hidden" {...register('zipCode')} />
        <input type="hidden" {...register('number')} />
        <input type="hidden" {...register('street')} />
        <input type="hidden" {...register('complement')} />
        <input type="hidden" {...register('neighborhood')} />
        <input type="hidden" {...register('city')} />
        <input type="hidden" {...register('state')} />
      </div>
    ),
  })
)

describe(FirstStoreForm.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('submits the slugified store address to createStore', async () => {
    // Arrange
    createStoreMutateAsync.mockResolvedValue({
      id: 'store-1',
      slug: 'padaria-boa',
    })
    render(<FirstStoreForm />)
    await userEvent.type(screen.getByLabelText('nome fantasia'), 'Padaria Boa')
    await userEvent.type(screen.getByLabelText('endereço'), 'Padaria Boa')

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Criar loja' }))

    // Assert
    expect(createStoreMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        customName: 'Padaria Boa',
        slug: 'padaria-boa',
      })
    )
  })

  it('shows the draft notice and restores saved values on mount', () => {
    // Arrange
    window.localStorage.setItem(
      'nino.draft.first-store',
      JSON.stringify({ customName: 'Padaria Salva' })
    )

    // Act
    render(<FirstStoreForm />)

    // Assert
    expect(
      screen.getByText('Continuamos de onde você parou.')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('nome fantasia')).toHaveValue('Padaria Salva')
  })

  it('does not show the draft notice with no saved draft', () => {
    // Arrange / Act
    render(<FirstStoreForm />)

    // Assert
    expect(
      screen.queryByText('Continuamos de onde você parou.')
    ).not.toBeInTheDocument()
  })

  it('flags the slug field when the store already exists', async () => {
    // Arrange
    createStoreMutateAsync.mockRejectedValue(new ApiError(409, 'conflict'))
    render(<FirstStoreForm />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Criar loja' }))

    // Assert
    expect(
      await screen.findByText(/este endereço já está em uso/i)
    ).toBeInTheDocument()
  })

  it('tells the person to check their connection when offline', async () => {
    // Arrange
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false)
    createStoreMutateAsync.mockRejectedValue(new Error('network'))
    render(<FirstStoreForm />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Criar loja' }))

    // Assert
    expect(
      await screen.findByText(/você está sem internet/i)
    ).toBeInTheDocument()
  })

  it('shows a generic error for any other failure', async () => {
    // Arrange
    createStoreMutateAsync.mockRejectedValue(new Error('boom'))
    render(<FirstStoreForm />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Criar loja' }))

    // Assert
    expect(
      await screen.findByText(/não foi possível criar a loja/i)
    ).toBeInTheDocument()
  })
})
