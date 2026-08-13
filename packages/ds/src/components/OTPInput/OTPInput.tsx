import { ClipboardEvent, useState } from 'react'

import { PinInput as ArkPinInput } from '@ark-ui/react/pin-input'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './OTPInput.module.css'

type OTPInputType = 'numeric' | 'alphabetic' | 'alphanumeric'

type OTPInputProps = {
  /** How many boxes. `4` or `6` */
  length?: 4 | 6
  value?: string[]
  onValueChange?: (value: string[]) => void
  /**
   * Called with the whole code once the last box is filled — this is what
   * submits the form
   */
  onValueComplete?: (value: string) => void
  placeholder?: string
  /** What each box accepts. Default: `numeric` */
  type?: OTPInputType
  /** Enables SMS OTP autocomplete */
  otp?: boolean
  disabled?: boolean
  invalid?: boolean
  className?: string
}

/*
 * O Ark valida o que foi colado contra o `type` antes de inserir, sem
 * nenhuma tolerância: o código copiado direto da mensagem ("Seu código é
 * 123456"), ou com um espaço sobrando, reprova na regex e a colagem inteira
 * é descartada em silêncio.
 *
 * A prop `sanitizeValue` do Ark deveria rodar antes dessa validação, mas em
 * @ark-ui/react 5.36 / @zag-js/pin-input 1.40 a função nunca é chamada
 * (verificado no navegador em 2026-08-12, com colagem real). Por isso a
 * limpeza é feita aqui, interceptando a colagem antes do Ark.
 */
const sanitizeByType: Record<OTPInputType, (value: string) => string> = {
  numeric: (value) => value.replace(/\D/g, ''),
  alphabetic: (value) => value.replace(/[^a-zA-Z]/g, ''),
  alphanumeric: (value) => value.replace(/[^a-zA-Z0-9]/g, ''),
}

/**
 * The boxes for a code that arrives by SMS or e-mail.
 *
 * ```tsx
 * <OTPInput length={6} otp onValueComplete={confirm} />
 *
 * - `otp` — Turns on the phone's one-time-code autofill, which offers the code straight from the message
 * ```
 */
export function OTPInput({
  length = 6,
  value,
  onValueChange,
  onValueComplete,
  placeholder = '○',
  type = 'numeric',
  otp = false,
  disabled,
  invalid,
  className,
}: OTPInputProps) {
  const [ownValue, setOwnValue] = useState<string[]>(() =>
    Array.from({ length }, () => '')
  )
  const currentValue = value ?? ownValue

  /* Intercepta na fase de captura, antes de o Ark ver o evento. Colagem já
   * limpa segue o caminho dele; só a suja é barrada e aplicada aqui. */
  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pasted = event.clipboardData.getData('text/plain')
    const cleaned = sanitizeByType[type](pasted).slice(0, length)
    if (!cleaned || cleaned === pasted) return

    event.preventDefault()
    event.stopPropagation()

    const next = Array.from({ length }, (_, index) => cleaned[index] ?? '')
    setOwnValue(next)
    onValueChange?.(next)
    if (cleaned.length === length) onValueComplete?.(cleaned)
  }

  return (
    <ArkPinInput.Root
      onPasteCapture={handlePaste}
      value={currentValue}
      onValueChange={({ value: v }) => {
        setOwnValue(v)
        onValueChange?.(v)
      }}
      onValueComplete={({ valueAsString }) => onValueComplete?.(valueAsString)}
      placeholder={placeholder}
      type={type}
      sanitizeValue={sanitizeByType[type]}
      otp={otp}
      disabled={disabled}
      invalid={invalid}
      className={mergeClasses(styles.digitRow, className)}
    >
      {Array.from({ length }).map((_, i) => (
        <ArkPinInput.Input key={i} index={i} className={styles.digitBox} />
      ))}
      <ArkPinInput.HiddenInput />
    </ArkPinInput.Root>
  )
}
