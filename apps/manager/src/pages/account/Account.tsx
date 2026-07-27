import { useState } from 'react'

import { Card } from '@nino/ds/components/Card'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { EditEmailModal } from '@compositions/EditEmailModal'
import {
  useProfile,
  useSaveProfile,
  useUpdateMyEmail,
} from '@hooks/account/useProfile'
import type { Profile } from '@custom_types/account'
import { formatPhone, toE164 } from '@utils/phone'

import styles from './Account.module.css'
import motion from '@styles/motion.module.css'
import card from '@styles/settingsCard.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateOf = (iso: string | null): string =>
  iso ? day.format(new Date(iso)) : '—'

const providerLabel: Record<string, string> = {
  local: 'E-mail e senha',
  google: 'Google',
}

export const Account = () => {
  const { data: profile, isPending } = useProfile()
  const { mutate: save, isPending: isSaving } = useSaveProfile()
  const { mutateAsync: saveEmail } = useUpdateMyEmail()

  const [draft, setDraft] = useState({ name: '', phone: '' })
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<Profile | undefined>(undefined)
  const [isEditingEmail, setIsEditingEmail] = useState(false)

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
      <PageHeader
        className={`${motion.deal} ${styles.header}`}
        title="Meus dados"
        accent="dados"
        description="É como a equipe te identifica no painel e no histórico dos pedidos."
      />

      {isPending ? (
        <Skeleton className={styles.skeleton} />
      ) : (
        <Card className={motion.settle}>
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
        </Card>
      )}

      {profile && (
        <Card className={`mt-4 ${motion.settle}`}>
          <p className={styles.factsTitle}>Sobre a conta</p>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>E-mail</dt>
              <dd className={styles.factValue}>
                {profile.credentials[0]?.email ?? '—'}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingEmail(true)}
                >
                  Editar
                </Button>
              </dd>
            </div>

            {[
              [
                'Login via',
                providerLabel[profile.credentials[0]?.provider ?? ''] ??
                  profile.credentials[0]?.provider ??
                  '—',
              ],
              ['Membro desde', dateOf(profile.createdAt)],
              ['Último acesso', dateOf(profile.lastLoginAt)],
            ].map(([label, value]) => (
              <div key={label} className={styles.fact}>
                <dt className={styles.factLabel}>{label}</dt>
                <dd className={styles.factValue}>{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      <EditEmailModal
        open={isEditingEmail}
        onOpenChange={setIsEditingEmail}
        title="Editar e-mail"
        hint="Usado para entrar no painel."
        currentEmail={profile?.credentials[0]?.email ?? null}
        onSave={(email) => saveEmail(email)}
      />
    </div>
  )
}
