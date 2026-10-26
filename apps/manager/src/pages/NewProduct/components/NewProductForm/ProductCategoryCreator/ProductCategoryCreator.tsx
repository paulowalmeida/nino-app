import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'
import { useNewProductFacade } from '@pages/NewProduct/facades/useNewProductFacade/useNewProductFacade'

import motion from '@styles/motion.module.css'
import styles from './ProductCategoryCreator.module.css'

type ProductCategoryCreatorProps = {
  onCategoryCreated: (categoryId: string) => void
}

export const ProductCategoryCreator = ({
  onCategoryCreated,
}: ProductCategoryCreatorProps) => {
  const { createCategory, isCreatingCategory } = useNewProductFacade()
  const [name, setName] = useState('')
  const [isNaming, setNaming] = useState(false)

  const handleCreate = async () => {
    try {
      const created = await createCategory(name.trim())
      onCategoryCreated(created.id)
      setName('')
      setNaming(false)
    } catch {
      setNaming(true)
    }
  }

  if (!isNaming) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={motion.press}
        onClick={() => setNaming(true)}
      >
        Criar uma categoria
      </Button>
    )
  }

  return (
    <Box className={`${motion.unroll} ${styles.categoryBox}`}>
      <Input
        autoFocus
        placeholder="Lanches"
        aria-label="Nome da nova categoria"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button
        type="button"
        size="sm"
        loading={isCreatingCategory}
        disabled={!name.trim()}
        className={motion.press}
        onClick={() => void handleCreate()}
      >
        Criar
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setNaming(false)}
      >
        Voltar
      </Button>
    </Box>
  )
}
