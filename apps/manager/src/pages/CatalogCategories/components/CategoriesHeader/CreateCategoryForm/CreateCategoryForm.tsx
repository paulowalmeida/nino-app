import { useRef } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import { CategoryIconPicker } from '@shared/components/CategoryIconPicker/CategoryIconPicker'
import { useRouteAction } from '@shared/hooks/ui/useRouteAction/useRouteAction'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './CreateCategoryForm.module.css'

export const CreateCategoryForm = () => {
  const {
    createName,
    createIcon,
    isCreating,
    setCreateName,
    setCreateIcon,
    submitCreate,
  } = useCatalogCategoriesFacade()
  const nameRef = useRef<HTMLInputElement>(null)
  useRouteAction('nova-categoria', () => nameRef.current?.focus())

  return (
    <Box
      as="form"
      gap={3}
      mb={6}
      className={`${motion.deal} ${styles.create}`}
      style={riseDelay(40)}
      onSubmit={(event) => {
        event.preventDefault()
        void submitCreate()
      }}
    >
      <Box
        direction={{ mobile: 'column', tablet: 'row' }}
        align={{ tablet: 'center' }}
        gap={2}
      >
        <Input
          ref={nameRef}
          value={createName}
          placeholder="Nova categoria — ex.: Sobremesas"
          aria-label="Nome da nova categoria"
          onChange={(event) => setCreateName(event.target.value)}
        />
        <Button
          type="submit"
          className={motion.press}
          loading={isCreating}
          disabled={!createName.trim()}
        >
          Adicionar
        </Button>
      </Box>
      <CategoryIconPicker
        value={createIcon}
        onChange={setCreateIcon}
        disabled={isCreating}
        singleRowAt4k
      />
    </Box>
  )
}
