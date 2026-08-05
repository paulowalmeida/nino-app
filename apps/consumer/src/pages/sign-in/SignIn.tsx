import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Chip } from '@nino/ds/components/Chip'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { OTPInput } from '@nino/ds/components/OTPInput'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { useRequestOtp } from '@hooks/useRequestOtp'
import { useStore } from '@hooks/useStore'
import { useVerifyOtp } from '@hooks/useVerifyOtp'
import { isCompletePhone, toE164 } from '@utils/phone'
import { resolveSlug } from '@utils/resolve-slug'
import { riseDelay } from '@utils/rise-delay'
import { displayName, storeInitials } from '@utils/store-info'

import styles from './SignIn.module.css'
import motion from '@styles/motion.module.css'

type Step = 'identify' | 'code'
type Channel = 'phone' | 'email'

const CODE_LENGTH = 6

const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'phone', label: 'Telefone' },
  { id: 'email', label: 'E-mail' },
]

/**
 * Entrar na loja é uma conversa de duas perguntas, uma por tela: o telefone e
 * o código que chegou nele. Nenhuma senha, nenhum cadastro antes da primeira
 * compra: o número que a pessoa já digita no checkout é a identidade dela.
 *
 * O nome não é perguntado aqui. Quem entrou quer entrar — cobrar um cadastro
 * na porta é pedir para a pessoa desistir dela. Ele é editável em
 * `/conta/dados` e o checkout pergunta na hora em que ele realmente importa,
 * que é quando alguém precisa gritar o pedido na cozinha.
 *
 * A loja aparece no alto com o azulejo que a vitrine e a caderneta usam: esta
 * é a porta de um balcão específico, não um login de plataforma, e a pessoa
 * precisa reconhecer onde está antes de entregar o número dela.
 */
export const SignIn = () => {
  const { slug: pathSlug } = useParams()
  const navigate = useNavigate()
  const home = pathSlug ? `/${pathSlug}` : '/'

  const { store } = useStore(resolveSlug(pathSlug) ?? undefined)

  const [step, setStep] = useState<Step>('identify')
  const [channel, setChannel] = useState<Channel>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const isEmail = channel === 'email'
  const ready = isEmail ? /.+@.+\..+/.test(email) : isCompletePhone(phone)
  const credentials = isEmail ? { email } : { phone: toE164(phone) }
  const sentTo = isEmail ? email : phone

  const request = useRequestOtp()
  const verify = useVerifyOtp()

  const handleIdentify = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return

    request.mutate(credentials, { onSuccess: () => setStep('code') })
  }

  const handleCode = (event: React.FormEvent) => {
    event.preventDefault()
    if (code.length !== CODE_LENGTH) return

    /*
     * Entrar devolve ao cardápio, não à conta: quem abre a loja veio comer, e
     * a conta é onde se ajusta cadastro. `replace` porque a porta já foi
     * atravessada — voltar no navegador tem que sair da loja, não cair de
     * novo num login que já não tem o que perguntar.
     */
    verify.mutate(
      { credentials, code },
      { onSuccess: () => void navigate(home, { replace: true }) }
    )
  }

  return (
    <div
      className={styles.page}
      style={
        store?.primaryColor
          ? ({ '--store-tint': store.primaryColor } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles.shell}>
        <Link
          to={home}
          className={`${motion.press} ${styles.back}`}
          aria-label="Voltar para a loja"
        >
          <Icon name="arrow-left" />
        </Link>

        {store && (
          <div className={`${motion.riseIn} ${styles.brand}`}>
            <div className={styles.tile}>
              {store.logoUrl ? (
                <img src={store.logoUrl} alt="" className={styles.logo} />
              ) : (
                storeInitials(store)
              )}
            </div>
            <p className={styles.store}>{displayName(store)}</p>
          </div>
        )}

        {step === 'identify' && (
          <form
            className={motion.riseIn}
            style={riseDelay(60)}
            onSubmit={handleIdentify}
          >
            <p className={styles.step}>Passo 1 de 2</p>
            <h1 className={styles.headline}>
              {isEmail ? 'Qual é o seu e-mail?' : 'Qual é o seu telefone?'}
            </h1>
            <p className={styles.note}>
              Mandamos um código de 6 dígitos para confirmar que é você. Sem
              senha para inventar nem lembrar depois.
            </p>

            {/* a escolha do canal vem antes do campo: é ela que decide o que
                digitar, e um campo que aceita as duas coisas não sabe mascarar
                nenhuma das duas */}
            <div className={styles.channels} role="tablist">
              {CHANNELS.map(({ id, label }) => (
                <Chip
                  key={id}
                  variant="tab"
                  selected={channel === id}
                  className={channel === id ? styles.channelOn : styles.channel}
                  onClick={() => setChannel(id)}
                >
                  {label}
                </Chip>
              ))}
            </div>

            {isEmail ? (
              <Input
                type="email"
                size="lg"
                aria-label="E-mail"
                autoComplete="email"
                placeholder="voce@email.com"
                className={styles.field}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            ) : (
              <PhoneInput
                size="lg"
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
                  ? 'Não achamos conta com esse e-mail. Entre pelo telefone ' +
                    '— depois dá para salvar o e-mail na sua conta.'
                  : 'Não conseguimos enviar o código agora. Tente de novo ' +
                    'em instantes.'}
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
            className={motion.riseIn}
            style={riseDelay(60)}
            onSubmit={handleCode}
          >
            <p className={styles.step}>Passo 2 de 2</p>
            <h1 className={styles.headline}>Digite o código</h1>
            <p className={styles.note}>
              Enviamos para <span className={styles.sentTo}>{sentTo}</span>. Ele
              vale por poucos minutos.
            </p>

            {/* o Ark controla um array de 6 posições: mandar um array curto
                (ou receber os buracos dele de volta) vira `undefined` no meio
                do código já na primeira tecla */}
            <OTPInput
              length={CODE_LENGTH}
              type="numeric"
              otp
              invalid={verify.isError}
              className={styles.codeField}
              value={Array.from(
                { length: CODE_LENGTH },
                (_, index) => code[index] ?? ''
              )}
              onValueChange={(digits) =>
                setCode(digits.map((digit) => digit ?? '').join(''))
              }
              onValueComplete={(filled) => setCode(filled)}
            />

            {verify.isError && (
              <Alert variant="error" className={styles.alert}>
                Código inválido ou expirado. Peça outro e tente de novo.
              </Alert>
            )}

            <Button
              type="submit"
              className={`${motion.press} ${styles.cta}`}
              disabled={code.length !== CODE_LENGTH || verify.isPending}
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
      </div>
    </div>
  )
}
