import { Accordion as ArkAccordion } from '@ark-ui/react/accordion'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { AccordionProps } from './Accordion.types'

const baseRoot =
  'w-full divide-y divide-gray-200 rounded-md border border-gray-200'

const baseItem = 'bg-white'

const baseTrigger =
  'flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-900 transition-colors outline-none hover:bg-[color-mix(in_srgb,var(--color-brand)_5%,white)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50'

const baseContent = 'accordion-content overflow-hidden text-sm text-gray-600'

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
    className="shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
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
          className={baseItem}
        >
          <ArkAccordion.ItemTrigger
            className={mergeClasses(baseTrigger, 'group')}
          >
            {item.trigger}
            <ChevronDown />
          </ArkAccordion.ItemTrigger>
          <ArkAccordion.ItemContent className={baseContent}>
            <div className={baseContentInner}>{item.content}</div>
          </ArkAccordion.ItemContent>
        </ArkAccordion.Item>
      ))}
    </ArkAccordion.Root>
  )
}

Accordion.displayName = 'Accordion'
