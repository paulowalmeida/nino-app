import { Header } from '@nino/ds/components/Header'
import { BackLink } from '@atoms/BackLink/BackLink'
import { CreateCategoryForm } from '@organisms/CreateCategoryForm/CreateCategoryForm'
import { useCreateCategoryInline } from '@hooks/product/useCreateCategoryInline'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'

import motion from '@styles/motion.module.css'

const DESCRIPTION =
  'As categorias agrupam os itens no app do cliente. Arraste para mudar ' +
  'a ordem em que aparecem lá.'

export const CategoriesHeaderContainer = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const create = useCreateCategoryInline(tenantId)

  return (
    <>
      <BackLink>Cardápio</BackLink>

      <Header
        mb={{ mobile: 5, desktop: 8 }}
        mt={2}
        className={motion.deal}
        title="Como o cardápio se organiza"
        accent="organiza"
        description={DESCRIPTION}
      />

      <CreateCategoryForm
        name={create.name}
        isPending={create.isPending}
        onNameChange={create.setName}
        onSubmit={create.submit}
      />
    </>
  )
}
