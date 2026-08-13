import { useState } from 'react'

import {
  ColorPicker as ArkColorPicker,
  parseColor,
} from '@ark-ui/react/color-picker'
import { Flexbox } from '@ds/components/Flexbox/Flexbox'
import { Icon } from '@ds/components/Icon/Icon'
import { Text } from '@ds/components/Text/Text'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import { readableInk } from '@ds/lib/readableInk/readableInk'

import { COLOR_PALETTE } from './ColorPicker.palette'
import styles from './ColorPicker.module.css'

const NINO_ORANGE = '#FF6B00'
const MID_TINT_INDEX = 5

const familyOf = (hex?: string) => {
  const wanted = hex?.toUpperCase()

  return (
    COLOR_PALETTE.find((family) => family.tints.includes(wanted ?? '')) ??
    COLOR_PALETTE[0]
  )
}

type ColorPickerProps = {
  /** Selected color as a hex string (e.g. `#FF6B00`) */
  value?: string
  /** Fired with the picked hex string */
  onValueChange?: (hex: string) => void
  /** Names the picker for assistive tech. Default: `Cor da loja` */
  label?: string
  disabled?: boolean
  className?: string
}

/**
 * Lets a store owner pick the color that paints their own storefront.
 *
 * The catalog has 242 tints, and showing them at once is a wall of color, so
 * the picker follows how the choice is actually made: first the hue — "I want
 * a blue" — then the shade, on a strip that runs from the palest to the
 * deepest tint of that hue, the way a paint fan opens.
 *
 * There is no free hex entry on purpose: an open picker let a store land on a
 * tint nobody had ever looked at against the product's cream surfaces.
 *
 * @param value - Currently selected hex
 *
 * @param onValueChange - Fired with the picked hex string
 *
 * @param label - Names the picker for assistive tech
 *
 * @example
 * <ColorPicker value={color} onValueChange={setColor} />
 */
export function ColorPicker({
  value,
  onValueChange,
  label = 'Cor da loja',
  disabled,
  className,
}: ColorPickerProps) {
  const [openFamily, setOpenFamily] = useState(() => familyOf(value).key)

  const selectedHex = (value ?? NINO_ORANGE).toUpperCase()
  const family =
    COLOR_PALETTE.find(({ key }) => key === openFamily) ?? COLOR_PALETTE[0]
  const selectedIndex = family.tints.indexOf(selectedHex)

  /* Trocar de matiz mantém a intensidade: quem estava num tom fechado de azul
     e passa para o verde quer o verde fechado, não recomeçar do meio. */
  const pickFamily = (nextKey: string, tints: string[]) => {
    setOpenFamily(nextKey)
    onValueChange?.(tints[selectedIndex === -1 ? MID_TINT_INDEX : selectedIndex])
  }

  return (
    <ArkColorPicker.Root
      value={parseColor(selectedHex)}
      disabled={disabled}
      aria-label={label}
      onValueChange={(e) => onValueChange?.(e.value.toString('hex'))}
      className={mergeClasses(styles.picker, className)}
    >
      <Flexbox direction="column" gap={4}>
        <Flexbox direction="column" gap={2}>
          <Text size="xs" weight="bold" color="faint" case="uppercase">
            Matiz
          </Text>

          <div className={styles.hueGrid}>
            {COLOR_PALETTE.map(({ key, name, anchor, tints }) => (
              <button
                key={key}
                type="button"
                title={name}
                aria-label={name}
                aria-pressed={key === family.key}
                disabled={disabled}
                className={styles.hueButton}
                onClick={() => pickFamily(key, tints)}
              >
                <span
                  className={styles.hueDot}
                  style={{ backgroundColor: anchor }}
                />
              </button>
            ))}
          </div>
        </Flexbox>

        <Flexbox direction="column" gap={2}>
          <Text size="xs" weight="bold" color="faint" case="uppercase">
            {family.name}
          </Text>

          {/* A escala inteira emendada, do mais claro ao mais fechado: é a
              amostra de tinta, e o corte entre dois tons mostra a diferença
              melhor que dois quadrados separados por um vão. */}
          <ArkColorPicker.SwatchGroup className={styles.shadeStrip}>
            {family.tints.map((tint) => (
              <ArkColorPicker.SwatchTrigger
                key={tint}
                value={tint}
                aria-label={`${family.name} ${tint}`}
                className={styles.shadeButton}
              >
                {/* O visto herda a tinta do próprio tom por `currentColor`:
                    sobre um amarelo claro, um visto branco some. */}
                <ArkColorPicker.Swatch
                  value={tint}
                  className={styles.shadeSwatch}
                  style={{ color: readableInk(tint) }}
                >
                  <ArkColorPicker.SwatchIndicator className={styles.pickedMark}>
                    <Icon name="check" size="sm" />
                  </ArkColorPicker.SwatchIndicator>
                </ArkColorPicker.Swatch>
              </ArkColorPicker.SwatchTrigger>
            ))}
          </ArkColorPicker.SwatchGroup>
        </Flexbox>
      </Flexbox>
    </ArkColorPicker.Root>
  )
}
