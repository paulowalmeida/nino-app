import { Accordion as ArkAccordion } from '@ark-ui/react/accordion'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { AccordionProps } from './Accordion.types'

/* Cada item é um bloco fechado em si: o cabeçalho é a superfície rebaixada
 * onde se clica e o corpo é a folha clara que sai dela. Sem grade em volta. */
const baseRoot = 'flex w-full flex-col gap-2'

const baseItem = 'overflow-hidden rounded-card bg-paper'

const baseTrigger =
  'flex w-full items-center justify-between bg-surface-sunk px-4 py-3 ' +
  'text-sm font-semibold text-ink transition-colors outline-none ' +
  'hover:bg-cream-deep focus-visible:outline-2 focus-visible:-outline-offset-2 ' +
  'focus-visible:outline-brand disabled:pointer-events-none ' +
  'disabled:opacity-50 data-[state=open]:bg-cream-deep'

const baseContent = 'accordion-content overflow-hidden text-sm text-muted'

const baseContentInner = 'px-4 pb-4 pt-0'

const ChevronDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export function Accordion({
  items,
  multiple = false,
  defaultValue,
  value,
  onValueChange,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
}: AccordionProps) {
  return (
    <ArkAccordion.Root
      multiple={multiple}
      collapsible
      defaultValue={defaultValue}
      value={value}
      onValueChange={({ value: v }) => onValueChange?.(v)}
      className={mergeClasses(baseRoot, className)}
    >
      {items.map((item) => (
        <ArkAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={mergeClasses(baseItem, itemClassName ?? '')}
        >
          <ArkAccordion.ItemTrigger
            className={mergeClasses(
              baseTrigger,
              'group',
              triggerClassName ?? ''
            )}
          >
            {item.trigger}
            <ChevronDown />
          </ArkAccordion.ItemTrigger>
          <ArkAccordion.ItemContent
            className={mergeClasses(baseContent, contentClassName ?? '')}
          >
            <div className={baseContentInner}>{item.content}</div>
          </ArkAccordion.ItemContent>
        </ArkAccordion.Item>
      ))}
    </ArkAccordion.Root>
  )
}

Accordion.displayName = 'Accordion'
