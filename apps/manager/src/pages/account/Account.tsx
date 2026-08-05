import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import type { Profile } from '@custom_types/account/profile'
import { EMAIL_PATTERN } from '@constants/auth.constants'
import {
  ACCOUNT_GHOST_FIELDS,
  ACCOUNT_PROVIDER_LABEL,
} from '@constants/account.constants'
import { useProfile } from '@hooks/account/useProfile'
import { useSaveProfile } from '@hooks/account/useSaveProfile'
import { useUpdateMyEmail } from '@hooks/account/useUpdateMyEmail'
import { formatPhone, toE164 } from '@utils/phone'

import styles from './Account.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateOf = (iso: string | null): string =>
  iso ? day.format(new Date(iso)) : '—'

type Draft = { name: string; phone: string; email: string }

export const Account = () => {
  const { data: profile, isPending } = useProfile()
  const { mutateAsync: saveProfile, isPending: isSavingProfile } =
    useSaveProfile()
  const { mutateAsync: saveEmail, isPending: isSavingEmail } =
    useUpdateMyEmail()

  const [draft, setDraft] = useState<Draft>({ name: '', phone: '', email: '' })
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState<Profile | undefined>(undefined)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  if (profile && profile !== seed) {
    setSeed(profile)
    setDraft({
      name: profile.name,
      phone: profile.phone ? formatPhone(profile.phone) : '',
      email: profile.credentials[0]?.email ?? '',
    })
    setDirty(false)
  }

  const change = (patch: Partial<Draft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
    setEmailError(null)
    setSaveError(null)
  }

  const isSaving = isSavingProfile || isSavingEmail

  /*
   * Nome, telefone e e-mail moram no mesmo grupo e saem no mesmo "Salvar":
   * para quem preenche, é um dado só, "meus dados" — mesmo o e-mail vivendo
   * em outra tabela (credencial de login) e outro endpoint por trás. A troca
   * de e-mail aqui não pede senha nem reverificação, então não há razão para
   * um fluxo à parte só porque a API separa os dois.
   */
  const handleSave = async () => {
    if (draft.email && !EMAIL_PATTERN.test(draft.email)) {
      setEmailError('E-mail inválido')
      return
    }

    const emailChanged = draft.email !== (profile?.credentials[0]?.email ?? '')

    try {
      await saveProfile({
        name: draft.name,
        phone: draft.phone ? toE164(draft.phone) : undefined,
      })
      if (emailChanged && draft.email) await saveEmail(draft.email)
      setSaveError(null)
    } catch {
      setSaveError('Não foi possível salvar. Confira os dados e tente de novo.')
    }
  }

  return (
    <div className={styles.page}>
      <p className={`${motion.deal} ${styles.eyebrow}`}>Minha conta</p>

      <header className={`${motion.deal} ${styles.head}`}>
        <h1 className={styles.title}>Meus dados</h1>
        <p className={styles.subtitle}>
          É como a equipe te identifica no painel e no histórico dos pedidos.
        </p>
      </header>

      {isPending ? (
        <div className={`${motion.settle} ${styles.fields}`}>
          {ACCOUNT_GHOST_FIELDS.map((size, index) => (
            <Skeleton
              key={index}
              className={
                size === 'wide'
                  ? `${styles.wide} ${styles.ghostField}`
                  : styles.ghostField
              }
            />
          ))}
        </div>
      ) : (
        <>
          <div className={`${motion.settle} ${styles.fields}`}>
            <FormField label="Nome" className={styles.wide}>
              <Input
                value={draft.name}
                onChange={(event) => change({ name: event.target.value })}
              />
            </FormField>

            <FormField
              label="E-mail"
              error={emailError ?? undefined}
              helperText="Usado para entrar no painel"
            >
              <Input
                type="email"
                placeholder="nome@exemplo.com"
                value={draft.email}
                onChange={(event) => change({ email: event.target.value })}
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

          {saveError && (
            <Alert variant="error" className={styles.saveError}>
              {saveError}
            </Alert>
          )}

          <div className={styles.actions}>
            {!isDirty && !saveError && (
              <p className={styles.status}>
                Nada mudou desde o último salvamento.
              </p>
            )}
            <Button
              loading={isSaving}
              disabled={!isDirty}
              className={motion.press}
              onClick={() => void handleSave()}
            >
              Salvar meus dados
            </Button>
          </div>
        </>
      )}

      {profile && (
        <section className={`${motion.settle} ${styles.about}`}>
          <p className={styles.groupTitle}>Sobre a conta</p>

          <dl className={styles.facts}>
            {[
              [
                'Login via',
                ACCOUNT_PROVIDER_LABEL[
                  profile.credentials[0]?.provider ?? ''
                ] ??
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
        </section>
      )}
    </div>
  )
}
