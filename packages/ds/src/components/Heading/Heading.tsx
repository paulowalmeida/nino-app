import { ElementType, HTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'
import { MarginProps, marginToClasses } from '@ds/lib/spacing/spacing'
import {
  TextAlign,
  textAlignClasses,
  TextColor,
  textColorClasses,
} from '@ds/lib/textStyles/textStyles'

import styles from './Heading.module.css'
import { HeadingLevel, HeadingSize } from './Heading.types'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  MarginProps & {
    level: HeadingLevel
    size?: HeadingSize
    color?: TextColor
    align?: TextAlign
  }

/* A escala saiu do que os apps já escreviam à mão, não de uma régua nova:
 * `xl` é o cabeçalho de tela do manager (o único que cresce no desktop),
 * `lg` e `md` são os dois títulos de bloco mais repetidos nos módulos CSS.
 * O peso é extrabold em todos porque nenhum título do app usa outro. */
const sizeClasses: Record<HeadingSize, string> = {
  '2xl': styles.sizeExtraExtraLarge,
  xl: styles.sizeExtraLarge,
  lg: styles.sizeLarge,
  md: styles.sizeMedium,
  sm: styles.sizeSmall,
}

/* O nível já entrega o tamanho do caso comum — `size` só entra quando a
 * aparência precisa divergir da estrutura (um h3 que abre um painel e
 * precisa pesar como título de página). */
const sizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'sm',
  6: 'sm',
}

/**
 * Page and section heading. `level` is the document outline (what screen
 * readers navigate by), `size` is appearance — they are set apart on
 * purpose so a block can look big without claiming a rank it doesn't have.
 *
 * A reusable composition never picks its own level: it takes one as a prop
 * and the page that mounts it decides, which is what keeps a single `h1`
 * per page.
 *
 * @param level - Heading rank, `1` to `6`. Renders the matching tag
 *
 * @param size - Visual size (`sm`, `md`, `lg`, `xl`). Defaults to the size
 * that matches `level`
 *
 * @param color - Entry from the DS text color tokens. Default: `strong`
 *
 * @param align - Text alignment. Default: `left`
 *
 * @param m - Margin on every side, from the Tailwind spacing scale. `mt`,
 * `mb`, `mx` and `my` narrow it to one axis or side
 *
 * @param className - Additional CSS classes
 *
 * @example
 * <Heading level={1}>Configurações</Heading>
 * <Heading level={3} size="xl" mb={4}>Resumo do dia</Heading>
 */
export function Heading({
  level,
  size,
  color = 'strong',
  align = 'left',
  m,
  mt,
  mb,
  mx,
  my,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as ElementType

  return (
    <Component
      className={mergeClasses(
        sizeClasses[size ?? sizeByLevel[level]],
        textColorClasses[color],
        textAlignClasses[align],
        marginToClasses({ m, mt, mb, mx, my }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
