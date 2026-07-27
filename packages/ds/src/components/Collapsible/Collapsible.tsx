import { Collapsible as ArkCollapsible } from '@ark-ui/react/collapsible'

import { CollapsibleProps } from './Collapsible.types'

/*
 * Mesmo par de estados do Accordion: fechado, o gatilho é a superfície de
 * marca e chama para si; aberto, recua para um fio de laranja e devolve o peso
 * ao conteúdo que acabou de aparecer.
 */
const triggerClass =
  'group flex w-full cursor-pointer items-center justify-between gap-2 ' +
  'rounded-card px-3 py-2 text-sm font-semibold outline-none ' +
  'transition-colors duration-200 bg-brand-soft text-brand-strong ' +
  'hover:bg-brand/18 focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2 disabled:pointer-events-none ' +
  'disabled:opacity-50 data-[state=open]:bg-brand/6 ' +
  'data-[state=open]:text-ink data-[state=open]:hover:bg-brand/10'

const sealClass =
  'grid size-6 shrink-0 place-items-center rounded-[6px] ' +
  'transition-colors duration-200 bg-brand/15 text-brand-strong ' +
  'group-data-[state=open]:bg-brand group-data-[state=open]:text-brand-foreground'

const contentClass = 'collapsible-content overflow-hidden text-sm text-muted'

const ChevronSeal = () => (
  <span className={sealClass}>
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-200 group-data-[state=open]:rotate-180"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </span>
)

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
      <ArkCollapsible.Trigger className={triggerClass}>
        {trigger}
        {indicator && <ChevronSeal />}
      </ArkCollapsible.Trigger>
      <ArkCollapsible.Content className={contentClass}>
        <div className="px-3 pb-3 pt-1">{children}</div>
      </ArkCollapsible.Content>
    </ArkCollapsible.Root>
  )
}

Collapsible.displayName = 'Collapsible'
