import { Button } from '@nino/ds/components/Button'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Input } from '@nino/ds/components/Input'
import { useCreateCategoryInline } from '@hooks/product/useCreateCategoryInline'
import { riseDelay } from '@utils/rise-delay'

import styles from './CreateCategoryForm.module.css'
import motion from '@styles/motion.module.css'

type CreateCategoryFormProps = { tenantId: string | null }

export const CreateCategoryForm = ({ tenantId }: CreateCategoryFormProps) => {
  const create = useCreateCategoryInline(tenantId)

  return (
    <Flexbox
      as="form"
      direction={{ mobile: 'column', tablet: 'row' }}
      align={{ tablet: 'center' }}
      gap={2}
      mb={6}
      className={`${motion.deal} ${styles.create}`}
      style={riseDelay(40)}
      onSubmit={(event) => {
        event.preventDefault()
        void create.submit()
      }}
    >
      <Input
        value={create.name}
        placeholder="Nova categoria — ex.: Sobremesas"
        aria-label="Nome da nova categoria"
        onChange={(event) => create.setName(event.target.value)}
      />
      <Button
        type="submit"
        className={motion.press}
        loading={create.isPending}
        disabled={!create.name.trim()}
      >
        Adicionar
      </Button>
    </Flexbox>
  )
}
