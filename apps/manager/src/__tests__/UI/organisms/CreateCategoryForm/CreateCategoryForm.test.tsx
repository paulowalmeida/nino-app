import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CreateCategoryForm } from '@organisms/CreateCategoryForm/CreateCategoryForm'

describe(CreateCategoryForm.name, () => {
  it('forwards the name and submit intent to the container', async () => {
    const onNameChange = vi.fn()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <CreateCategoryForm
        name="Sobremesas"
        isPending={false}
        onNameChange={onNameChange}
        onSubmit={onSubmit}
      />
    )

    fireEvent.change(screen.getByLabelText('Nome da nova categoria'), {
      target: { value: 'Bolos' },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(onNameChange).toHaveBeenCalledWith('Bolos')
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
