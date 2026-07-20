import { useState } from 'react'

import { Button, FormField, Input, Skeleton } from '@nino/ds'

import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'
import { useProfile, useSaveProfile } from '@hooks/account/useProfile'
import type { Profile } from '@custom_types/account'
import { formatPhone, toE164 } from '@utils/phone'

import styles from './Account.module.css'
import motion from '@styles/motion.module.css'
import card from '@styles/settingsCard.module.css'

export const Account = () => {
  const { data: profile, isPending } = useProfile()
  const { mutate: save, isPending: isSaving } = useSaveProfile()

  const [draft, setDraft] = useState({ name: '', phone: '' })
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<Profile | undefined>(undefined)

  if (profile && profile !== seed) {
    setSeed(profile)
    setDraft({
      name: profile.name,
      phone: profile.phone ? formatPhone(profile.phone) : '',
    })
    setDirty(false)
  }

  const change = (patch: Partial<typeof draft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
  }

  const handleSave = () =>
    save({
      name: draft.name,
      phone: draft.phone ? toE164(draft.phone) : undefined,
    })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Eyebrow>Sua conta</Eyebrow>
        <PageTitle accent="dados">Meus dados</PageTitle>
        <p className={styles.subtitle}>
          É como a equipe te identifica no painel e no histórico dos pedidos.
        </p>
      </header>

      {isPending ? (
        <Skeleton className={styles.skeleton} />
      ) : (
        <section className={card.card}>
          <div className={styles.fields}>
            <FormField label="Nome">
              <Input
                value={draft.name}
                onChange={(event) => change({ name: event.target.value })}
              />
            </FormField>

            <FormField
              label="Telefone"
              helperText="Usado para recuperar o acesso"
            >
              <Input
                inputMode="tel"
                value={draft.phone}
                onChange={(event) => change({ phone: event.target.value })}
              />
            </FormField>
          </div>

          <Button
            loading={isSaving}
            disabled={!isDirty}
            className={`${motion.press} ${card.save}`}
            onClick={handleSave}
          >
            Salvar meus dados
          </Button>
        </section>
      )}
    </div>
  )
}
