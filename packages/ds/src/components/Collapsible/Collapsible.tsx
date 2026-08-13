import type { ReactNode } from 'react'

import { Collapsible as ArkCollapsible } from '@ark-ui/react/collapsible'
import { DisclosureSeal } from '@ds/components/DisclosureSeal/DisclosureSeal'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Collapsible.module.css'

type CollapsibleProps = {
  /** Always-visible element that toggles the content */
  trigger: ReactNode
  /** Collapsible content revealed when open */
  children: ReactNode
  /**
   * Draws the chevron seal on the right of the trigger. Leave it off when the
   * trigger already carries its own open/close cue.
   */
  indicator?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
}

/**
 * Show/hide a block of content behind a trigger (Ark `Collapsible`).
 * Closed, the trigger wears the brand surface; open, it steps back so the
 * revealed content reads first.
 *
 * @param trigger - Always-visible toggle element
 *
 * @param indicator - Draws the chevron seal; skip it when the trigger already
 * says "Ver itens"/"Ocultar" on its own
 *
 * @param onOpenChange - Fired when the open state changes
 */
export function Collapsible({
  trigger,
  children,
  indicator = false,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  className,
}: CollapsibleProps) {
  return (
    <ArkCollapsible.Root
      open={open}
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={({ open: o }) => onOpenChange?.(o)}
      className={className}
    >
      {/* `group` fica literal: é o marcador que o selo lê para virar de tom
          quando o painel abre. */}
      <ArkCollapsible.Trigger className={mergeClasses('group', styles.toggleHeader)}>
        {trigger}
        {indicator && <DisclosureSeal />}
      </ArkCollapsible.Trigger>
      {/* `collapsible-content` é global: é dela que o keyframe de abrir e
          fechar depende, então não pode virar hash do CSS Module. */}
      <ArkCollapsible.Content
        className={mergeClasses('collapsible-content', styles.panel)}
      >
        <div className={styles.panelBody}>{children}</div>
      </ArkCollapsible.Content>
    </ArkCollapsible.Root>
  )
}
