import { useEffect, useMemo, useRef, useState } from 'react'

import { Combobox } from '@ds/components/Combobox/Combobox'
import { ComboboxSize } from '@ds/components/Combobox/Combobox.types'
import { maskTime } from '@ds/lib/masks/masks'

type TimePickerProps = {
  /**
   * Minutes between one slot and the next. Default: `15` — a whole day at
   * that step is 96 options, which is why the list searches
   */
  step?: number
  placeholder?: string
  /** Height and padding, matching the other fields. Default: `md` */
  size?: ComboboxSize
  error?: boolean
  disabled?: boolean
  /**
   * Selected time as `HH:mm`. Leave it out and pass `defaultValue` to let the
   * component keep its own
   */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  /** Accessible name, for when no visible label wraps it */
  ariaLabel?: string
}

const pad = (value: number): string => String(value).padStart(2, '0')

/** Keeps a typed search shaped like `HH:mm`: digits and `:` only, at most
 * 4 digits and one `:`. The committed value still only ever comes from
 * picking a grid slot, so this only guards what the search can look like. */
const isValidTimeQuery = (value: string): boolean => {
  if (!/^[\d:]*$/.test(value)) return false
  const digitCount = value.replace(/:/g, '').length
  const colonCount = value.length - digitCount
  return digitCount <= 4 && colonCount <= 1
}

/** A fully typed `HH:mm`, hour and minute both in range. */
const isCompleteTime = (value: string): boolean =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

const buildOptions = (step: number) => {
  const options = []
  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    const label = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
    options.push({ value: label, label })
  }
  return options
}

/**
 * Time of day picked from a searchable list of `HH:mm` slots — typing "14"
 * jumps to 14:00.
 *
 * It is a `Combobox` underneath, and there is no free typing outside the
 * grid of slots: whatever reaches the API is always a valid time, so no
 * screen has to guard against "24:71" or "8h".
 *
 * ```tsx
 * <FormField label="Abre às">
 *   <TimePicker value={opensAt} onValueChange={setOpensAt} step={30} />
 * </FormField>
 * ```
 */
export function TimePicker({
  step = 15,
  placeholder = '--:--',
  size = 'md',
  error = false,
  disabled,
  value,
  defaultValue,
  onValueChange,
  className,
  ariaLabel,
}: TimePickerProps) {
  const options = useMemo(() => buildOptions(step), [step])
  const [inputValue, setInputValue] = useState(value ?? defaultValue ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const inputValueRef = useRef(inputValue)
  inputValueRef.current = inputValue
  /* Último horário efetivamente comitado (por seleção ou blur válido), para
   * reverter a digitação inválida sem perder o valor não controlado. */
  const committedRef = useRef(value ?? defaultValue ?? '')

  /* Um `value` controlado pode mudar por fora (reset de formulário, seleção
   * programática); mantém o texto digitado em sincronia com ele. */
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value)
      committedRef.current = value
    }
  }, [value])

  useEffect(() => {
    const input = inputRef.current
    if (!disabled || !input) return

    input.setSelectionRange(0, 0)
    input.blur()
  }, [disabled])

  /* Listeners nativos, não os sintéticos do Ark: esses props são consumidos
   * pelo próprio Combobox internamente, e um `onFocus`/`onBlur` de fora os
   * substitui em vez de compor, quebrando o state machine do Ark. */
  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const selectAll = () => input.select()
    const applyMask = () => {
      const masked = maskTime(input.value)
      if (masked !== input.value) input.value = masked
      inputValueRef.current = masked
      setInputValue(masked)
    }
    input.addEventListener('focus', selectAll)
    input.addEventListener('click', selectAll)
    /* O listener nativo roda no próprio input antes do listener delegado do
     * React/Ark no root. Assim o Ark já recebe `14:30`, nunca o cru `1430`. */
    input.addEventListener('input', applyMask)
    return () => {
      input.removeEventListener('focus', selectAll)
      input.removeEventListener('click', selectAll)
      input.removeEventListener('input', applyMask)
    }
  }, [])

  /* Selecionar um item da lista já comita o valor. Sair do campo depois de
   * digitar um horário completo — sem clicar na opção — também precisa
   * comitar; senão o texto formatado fica só visual e a mudança se perde. */
  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const commitOnBlur = () => {
      const typed = inputValueRef.current
      if (isCompleteTime(typed)) {
        if (typed === committedRef.current) return
        committedRef.current = typed
        onValueChange?.(typed)
      } else {
        setInputValue(committedRef.current)
      }
    }
    input.addEventListener('blur', commitOnBlur)
    return () => input.removeEventListener('blur', commitOnBlur)
  }, [onValueChange])

  return (
    <Combobox
      key={disabled ? 'disabled' : 'enabled'}
      ref={inputRef}
      options={options}
      placeholder={placeholder}
      size={size}
      error={error}
      disabled={disabled}
      inputValue={inputValue}
      onInputValueChange={(next) => setInputValue(maskTime(next))}
      onValueChange={(next) => {
        setInputValue(next)
        committedRef.current = next
        onValueChange?.(next)
      }}
      emptyMessage="Nenhum horário encontrado"
      className={className}
      isValidQuery={isValidTimeQuery}
      maxLength={5}
      ariaLabel={ariaLabel}
    />
  )
}
