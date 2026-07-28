import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { useCompleteProfile } from '@hooks/useCompleteProfile'
import { useRequestOtp } from '@hooks/useRequestOtp'
import { useVerifyOtp } from '@hooks/useVerifyOtp'
import { isCompletePhone, toE164 } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'

import styles from './SignIn.module.css'
import motion from '@styles/motion.module.css'

type Step = 'identify' | 'code' | 'name'
type Channel = 'phone' | 'email'

const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'phone', label: 'Telefone' },
  { id: 'email', label: 'E-mail' },
]

/**
 * Entrar na loja é uma conversa de três perguntas, uma por tela: o telefone,
 * o código que chegou nele e — só de quem nunca disse — o nome. Nenhuma senha,
 * nenhum cadastro antes da primeira compra: o número que a pessoa já digita no
 * checkout é a identidade dela.
 */
export const SignIn = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const home = slug ? `/${slug}` : '/'
  const account = slug ? `/${slug}/conta` : '/conta'

  const [step, setStep] = useState<Step>('identify')
  const [channel, setChannel] = useState<Channel>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  const isEmail = channel === 'email'
  const ready = isEmail ? /.+@.+\..+/.test(email) : isCompletePhone(phone)
  const credentials = isEmail ? { email } : { phone: toE164(phone) }
  const sentTo = isEmail ? email : phone

  const request = useRequestOtp()
  const verify = useVerifyOtp()
  const profile = useCompleteProfile()

  const handleIdentify = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return

    request.mutate(credentials, { onSuccess: () => setStep('code') })
  }

  const handleCode = (event: React.FormEvent) => {
    event.preventDefault()
    if (code.length !== 6) return

    verify.mutate(
      { credentials, code },
      {
        onSuccess: (customer) => {
          if (customer.profileCompletedAt) void navigate(account)
          else setStep('name')
        },
      }
    )
  }

  const handleName = (event: React.FormEvent) => {
    event.preventDefault()
    if (name.trim().length < 2) return

    profile.mutate(
      { name: name.trim() },
      { onSuccess: () => void navigate(account) }
    )
  }

  return (
    <div className={styles.page}>
      <header className={`${motion.riseIn} ${styles.header}`}>
        <Link
          to={home}
          className={`${motion.press} ${styles.back}`}
          aria-label="Voltar para a loja"
        >
          ←
        </Link>
        <h1 className={styles.title}>Sua conta</h1>
      </header>

      {step === 'identify' && (
        <form
          className={`${motion.riseIn} ${styles.card}`}
          style={riseDelay(60)}
          onSubmit={handleIdentify}
        >
          <p className={styles.eyebrow}>Passo 1 de 2</p>
          <h2 className={styles.headline}>
            {isEmail ? 'Qual é o seu e-mail?' : 'Qual é o seu telefone?'}
          </h2>
          <p className={styles.note}>
            Mandamos um código de 6 dígitos para confirmar que é você. Sem senha
            para inventar nem lembrar depois.
          </p>

          {/* a escolha do canal vem antes do campo: é ela que decide o que
              digitar, e um campo que aceita as duas coisas não sabe mascarar
              nenhuma das duas */}
          <div className={styles.channels} role="tablist">
            {CHANNELS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={channel === id}
                className={channel === id ? styles.channelOn : styles.channel}
                onClick={() => setChannel(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {isEmail ? (
            <Input
              type="email"
              aria-label="E-mail"
              autoComplete="email"
              placeholder="voce@email.com"
              className={styles.field}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : (
            <PhoneInput
              aria-label="Telefone"
              autoComplete="tel"
              className={styles.field}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          )}

          {request.isError && (
            <Alert variant="error" className={styles.alert}>
              {isEmail
                ? 'Não achamos conta com esse e-mail. Entre pelo telefone — depois dá para salvar o e-mail na sua conta.'
                : 'Não conseguimos enviar o código agora. Tente de novo em instantes.'}
            </Alert>
          )}

          <Button
            type="submit"
            className={`${motion.press} ${styles.cta}`}
            disabled={!ready || request.isPending}
          >
            {request.isPending ? 'Enviando…' : 'Enviar código'}
          </Button>
        </form>
      )}

      {step === 'code' && (
        <form
          className={`${motion.riseIn} ${styles.card}`}
          style={riseDelay(60)}
          onSubmit={handleCode}
        >
          <p className={styles.eyebrow}>Passo 2 de 2</p>
          <h2 className={styles.headline}>Digite o código</h2>
          <p className={styles.note}>
            Enviamos para <strong>{sentTo}</strong>. Ele vale por poucos
            minutos.
          </p>

          <Input
            aria-label="Código de 6 dígitos"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            className={`${styles.field} ${styles.codeField}`}
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
            }
          />

          {verify.isError && (
            <Alert variant="error" className={styles.alert}>
              Código inválido ou expirado. Peça outro e tente de novo.
            </Alert>
          )}

          <Button
            type="submit"
            className={`${motion.press} ${styles.cta}`}
            disabled={code.length !== 6 || verify.isPending}
          >
            {verify.isPending ? 'Confirmando…' : 'Entrar'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className={`${motion.press} ${styles.secondary}`}
            onClick={() => {
              setCode('')
              setStep('identify')
            }}
          >
            {isEmail ? 'Usar outro e-mail' : 'Usar outro telefone'}
          </Button>
        </form>
      )}

      {step === 'name' && (
        <form
          className={`${motion.riseIn} ${styles.card}`}
          style={riseDelay(60)}
          onSubmit={handleName}
        >
          <p className={styles.eyebrow}>Falta só isto</p>
          <h2 className={styles.headline}>Como a loja te chama?</h2>
          <p className={styles.note}>
            O nome aparece na comanda, para a cozinha e o entregador saberem de
            quem é o pedido.
          </p>

          <Input
            aria-label="Seu nome"
            autoComplete="name"
            className={styles.field}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          {profile.isError && (
            <Alert variant="error" className={styles.alert}>
              Não deu para salvar seu nome agora. Tente de novo.
            </Alert>
          )}

          <Button
            type="submit"
            className={`${motion.press} ${styles.cta}`}
            disabled={name.trim().length < 2 || profile.isPending}
          >
            {profile.isPending ? 'Salvando…' : 'Concluir'}
          </Button>
        </form>
      )}
    </div>
  )
}
