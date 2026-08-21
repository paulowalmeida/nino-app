import { Button } from '@nino/ds/components/Button'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Input } from '@nino/ds/components/Input'
import { riseDelay } from '@utils/rise-delay'

import styles from './CreateCategoryForm.module.css'
import motion from '@styles/motion.module.css'

type CreateCategoryFormProps = {
  name: string
  isPending: boolean
  onNameChange: (name: string) => void
  onSubmit: () => Promise<void>
}

export const CreateCategoryForm = ({
  name,
  isPending,
  onNameChange,
  onSubmit,
}: CreateCategoryFormProps) => (
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
        void onSubmit()
      }}
    >
      <Input
        value={name}
        placeholder="Nova categoria — ex.: Sobremesas"
        aria-label="Nome da nova categoria"
        onChange={(event) => onNameChange(event.target.value)}
      />
      <Button
        type="submit"
        className={motion.press}
        loading={isPending}
        disabled={!name.trim()}
      >
        Adicionar
      </Button>
    </Flexbox>
  )
