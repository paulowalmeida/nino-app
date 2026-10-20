import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { StoreForm } from '@shared/components/StoreForm/StoreForm'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

type UnitsStoreFormProps = {
  onChange: (values: Partial<FirstStoreFormValues>) => void
}

export const UnitsStoreForm = ({ onChange }: UnitsStoreFormProps) => {
  const { typeOptions, submitStore } = useUnitsFacade()
  return (
    <StoreForm
      typeOptions={typeOptions}
      onSubmitStore={submitStore}
      onChange={onChange}
      submitLabel="Criar loja"
    />
  )
}
