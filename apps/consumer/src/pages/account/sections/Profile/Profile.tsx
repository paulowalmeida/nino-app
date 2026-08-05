import { useState } from 'react'

import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { toast } from '@nino/ds/components/Toast'
import { useCompleteProfile } from '@hooks/useCompleteProfile'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { formatPhone } from '@utils/phone'
import { hasProfanity } from '@utils/profanity'

import section from '../section.module.css'

/**
 * Quem a loja pensa que você é. O nome vale para a comanda, o e-mail é a
 * segunda porta de entrada — e o telefone, que é a identidade da conta, só
 * aparece: trocá-lo seria trocar de conta, não editar um campo.
 */
export const Profile = () => {
  const { customer } = useCustomerSession()
  const save = useCompleteProfile()

  /* conta aberta por telefone guarda o número no campo `name` até a pessoa
     dizer como se chama — o formulário nasce vazio, não com o telefone */
  const savedName = customer?.profileCompletedAt ? (customer?.name ?? '') : ''

  const [name, setName] = useState(savedName)
  const [email, setEmail] = useState(customer?.email ?? '')

  const trimmedName = name.trim()
  const trimmedEmail = email.trim()

  const emailValid = !trimmedEmail || /.+@.+\..+/.test(trimmedEmail)
  /* o nome vai para a comanda e para as telas do painel — palavrão fica de
     fora antes de sair do aparelho, e a API recusa de novo do outro lado */
  const nameClean = !hasProfanity(trimmedName)
  const changed =
    trimmedName !== savedName || trimmedEmail !== (customer?.email ?? '')
  const ready =
    trimmedName.length >= 2 && nameClean && emailValid && changed

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return

    save.mutate(
      { name: trimmedName, email: trimmedEmail || undefined },
      {
        onSuccess: () => toast.success('Dados salvos.'),
        onError: () => toast.error('Não deu para salvar agora.'),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className={section.eyebrow}>Dados pessoais</p>
      <h2 className={section.headline}>Como a loja te encontra</h2>
      <p className={section.note}>
        O nome vai na comanda, para a cozinha e o entregador saberem de quem é
        o pedido.
      </p>

      <div className={section.card}>
        <FormField
          label="Nome"
          labelClassName={section.label}
          error={
            !nameClean
              ? 'Esse nome vai ser lido em voz alta na cozinha — escolha outro.'
              : undefined
          }
        >
          <Input
            autoComplete="name"
            error={!nameClean}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>

        <div className={section.field}>
          <label className={section.label} htmlFor="profile-phone">
            Telefone
          </label>
          <p className={section.readonly} id="profile-phone">
            {formatPhone(customer?.phone ?? '')}
          </p>
          <p className={section.hint}>
            É por ele que você entra na conta. Para usar outro número, entre
            com ele — a loja abre uma conta nova.
          </p>
        </div>

        <FormField
          label={
            <>
              E-mail <span className={section.hint}>(opcional)</span>
            </>
          }
          labelClassName={section.label}
          helperText="Salvando o e-mail você também passa a entrar por ele, além do telefone."
        >
          <Input
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            error={!emailValid}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>
      </div>

      <div className={section.actions}>
        <Button
          type="submit"
          className={section.primary}
          disabled={!ready || save.isPending}
        >
          {save.isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
