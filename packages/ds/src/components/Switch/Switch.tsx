import { Switch as ArkSwitch } from '@ark-ui/react/switch'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { SwitchProps, SwitchSize } from './Switch.types'

const rootSizeClasses: Record<SwitchSize, string> = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
}

const thumbSizeClasses: Record<SwitchSize, string> = {
  sm: 'h-3 w-3 data-[state=checked]:translate-x-3',
  md: 'h-4 w-4 data-[state=checked]:translate-x-4',
}

const baseControl =
  /* Trilho rebaixado com uma placa deslizando por cima — o mesmo par de
   * superfícies das abas e da paginação, reduzido a um controle. */
  'inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 ' +
  'border-transparent bg-surface-mute transition-colors ' +
  'data-[state=checked]:bg-brand focus-visible:outline-2 ' +
  'focus-visible:outline-brand focus-visible:outline-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const baseThumb =
  'pointer-events-none block rounded-full bg-white shadow-card ring-0 ' +
  'transition-transform data-[state=unchecked]:translate-x-0'

export function Switch({
  size = 'md',
  className,
  onCheckedChange,
  checked,
  defaultChecked,
  ...props
}: SwitchProps) {
  return (
    <ArkSwitch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={({ checked: c }) => onCheckedChange?.(c)}
      {...props}
    >
      <ArkSwitch.Control
        className={mergeClasses(baseControl, rootSizeClasses[size], className)}
      >
        <ArkSwitch.Thumb
          className={mergeClasses(baseThumb, thumbSizeClasses[size])}
        />
      </ArkSwitch.Control>
      <ArkSwitch.HiddenInput />
    </ArkSwitch.Root>
  )
}
