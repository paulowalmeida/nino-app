import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { useCatalogCategoriesFacade } from '@pages/CatalogCategories/facades/useCatalogCategoriesFacade/useCatalogCategoriesFacade'
import { CategoryIconPicker } from '@shared/components/CategoryIconPicker/CategoryIconPicker'

const FORM_ID = 'edit-category-form'

export const EditCategoryDialog = () => {
  const {
    editTarget: target,
    editName,
    editIcon,
    isRenaming,
    setEditName,
    setEditIcon,
    submitEdit,
    closeEdit,
  } = useCatalogCategoriesFacade()

  return (
    <Modal
      size="lg"
      open={!!target}
      onOpenChange={(open) => !open && closeEdit()}
      header={
        <Heading level={2} size="md">
          Editar categoria
        </Heading>
      }
      body={
        <Box
          as="form"
          id={FORM_ID}
          gap={3}
          onSubmit={(event) => {
            event.preventDefault()
            void submitEdit()
          }}
        >
          <Input
            autoFocus
            value={editName}
            aria-label="Nome da categoria"
            onChange={(event) => setEditName(event.target.value)}
          />
          <CategoryIconPicker
            value={editIcon}
            onChange={setEditIcon}
            disabled={isRenaming}
          />
        </Box>
      }
      footer={
        <>
          <Button variant="ghost" onClick={closeEdit} disabled={isRenaming}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={isRenaming}
            disabled={!editName.trim()}
          >
            Salvar
          </Button>
        </>
      }
    />
  )
}
