import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { toast } from '@nino/ds/components/Toast'
import {
  NewProductFields,
  type NewProductFormValues,
} from '@organisms/NewProductFields/NewProductFields'
import { BackLink } from '@atoms/BackLink/BackLink'
import { useCategories } from '@hooks/product/useCategories'
import { useCreateCategory } from '@hooks/product/useCreateCategory'
import { useCreateMenuItem } from '@hooks/product/useCreateMenuItem'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { toCreateMenuItemRequest } from '@adapters/product-form.adapter'
import {
  NewProductSkeleton,
} from '@skeletons/pages/NewProductSkeleton/NewProductSkeleton'
import { riseDelay } from '@utils/rise-delay'

import styles from './NewProduct.module.css'
import motion from '@styles/motion.module.css'

export const NewProduct = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const navigate = useNavigate()

  const { categories, isPending: isCategoriesPending } = useCategories(tenantId)
  const { mutateAsync: addCategory, isPending: isAddingCategory } =
    useCreateCategory(tenantId)
  const { mutateAsync: addItem } = useCreateMenuItem(tenantId)

  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewProductFormValues>({
    defaultValues: { name: '', description: '', price: '', categoryId: '' },
  })

  const name = useWatch({ control, name: 'name' })
  const description = useWatch({ control, name: 'description' })

  const options = categories.map(({ id, name }) => ({
    value: id,
    label: name,
  }))

  if (isCategoriesPending) return <NewProductSkeleton />

  const onSubmit = async (values: NewProductFormValues) => {
    try {
      const result = await addItem({
        data: toCreateMenuItemRequest(values),
        image: photoFile,
      })

      if (result.imageUploadFailed) {
        toast.warning(
          'Item criado, mas a foto não subiu',
          'Abra o item no cardápio e envie a foto de novo.'
        )
      }

      void navigate('..', { relative: 'path' })
    } catch {
      setError('root', {
        message:
          'Não foi possível cadastrar. Confira os campos e tente de novo.',
      })
    }
  }

  return (
    <div className={styles.page}>
      <BackLink>Cardápio</BackLink>

      <Header
        className={styles.header}
        mb={5}
        title="Novo item"
        accent="item"
        description="O que o cliente vê no cardápio, tudo em um lugar só."
      />

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <NewProductFields
          name={name}
          description={description}
          onStagedFile={setPhotoFile}
          categories={options}
          register={register}
          control={control}
          errors={errors}
          onAddCategory={addCategory}
          isAddingCategory={isAddingCategory}
          onCategoryCreated={(categoryId) =>
            setValue('categoryId', categoryId, { shouldValidate: true })
          }
        />

        <div
          className={`${motion.deal} ${styles.actions}`}
          style={riseDelay(320)}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => void navigate('..', { relative: 'path' })}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Cadastrar item
          </Button>
        </div>
      </form>
    </div>
  )
}
