import { useState } from 'react'

import { useCreateCategory } from '@hooks/product/useCreateCategory'

export const useCreateCategoryInline = (tenantId: string | null) => {
  const { mutateAsync, isPending } = useCreateCategory(tenantId)
  const [name, setName] = useState('')

  /* O toast de erro global avisa; aqui só o campo não pode se limpar
     à toa. */
  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    try {
      await mutateAsync(trimmed)
      setName('')
    } catch {
      /* o nome digitado fica no campo pra pessoa tentar de novo */
    }
  }

  return { name, setName, submit, isPending }
}
