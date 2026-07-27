import { Accordion as ArkAccordion } from '@ark-ui/react/accordion'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { AccordionProps } from './Accordion.types'

/*
 * A intensidade da marca migra de lugar conforme o estado. Fechado, o cabeçalho
 * é a única coisa na tela: leva a superfície de marca e o texto laranja, para
 * ler como "tem conteúdo aqui". Aberto, ele recua para um fio de laranja e
 * devolve o peso ao texto revelado — quem tem que ser lido agora é o conteúdo,
 * não o botão que o abriu.
 */
const baseRoot = 'flex w-full flex-col gap-2'

const baseItem = 'overflow-hidden rounded-card bg-white'

const baseTrigger =
  'group flex cursor-pointer w-full items-center justify-between gap-3 px-4 py-3 ' +
  'text-sm font-semibold outline-none transition-colors duration-200 ' +
  'bg-brand-soft text-brand-strong hover:bg-brand/18 ' +
  'focus-visible:outline-2 focus-visible:-outline-offset-2 ' +
  'focus-visible:outline-brand disabled:pointer-events-none ' +
  'disabled:opacity-50 data-[state=open]:bg-brand/6 ' +
  'data-[state=open]:text-ink data-[state=open]:hover:bg-brand/10'

const baseContent = 'accordion-content overflow-hidden text-sm text-muted'

const baseContentInner = 'px-4 pb-4 pt-0'

/* O mesmo selo quadrado do Alert e do Stepper: fechado é contorno de marca,
 * aberto vira tinta cheia — o botão apagou, mas o marcador acendeu. */
const chevronSeal =
  'grid size-6 shrink-0 place-items-center rounded-[6px] ' +
  'transition-colors duration-200 bg-brand/15 text-brand-strong ' +
  'group-data-[state=open]:bg-brand group-data-[state=open]:text-brand-foreground'

const ChevronDown = () => (
  <span className={chevronSeal}>
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
            className={mergeClasses(baseTrigger, triggerClassName ?? '')}
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
