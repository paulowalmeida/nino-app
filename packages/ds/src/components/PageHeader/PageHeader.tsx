import { mergeClasses } from '@ds/lib/mergeClasses'

import { PageHeaderProps } from './PageHeader.types'

/* Sem fio embaixo: o respiro separa o cabeçalho do conteúdo, e a régua a
 * mais só some no meio das superfícies rebaixadas da página. */
const baseRoot = 'flex flex-col gap-3 pb-5'

const titleClass =
  'font-display text-xl font-extrabold tracking-[-0.02em] text-ink lg:text-2xl'

/* O traço peach fica atrás do texto, como na landing — pseudo-elemento no
 * lugar de sublinhado, para o filete não encostar nas descidas das letras. */
const accentClass =
  'relative whitespace-nowrap after:absolute after:inset-x-0 ' +
  'after:bottom-[0.08em] after:-z-[1] after:h-[0.16em] after:rounded-sm ' +
  "after:bg-peach-deep after:content-['']"

const descriptionClass = 'mt-1 text-sm text-subtle'

/**
 * Page heading with title, optional description, breadcrumb and actions.
 * Pure composition — no Ark primitive.
 *
 * @param title - Main page title
 *
 * @param accent - Word inside `title` that gets the peach underline
 *
 * @param description - Supporting line under the title
 *
 * @param breadcrumb - Trail rendered above the title
 *
 * @param actions - Right-aligned actions (buttons, menus)
 *
 * @example
 * <PageHeader title="Quem toca a equipe" accent="equipe" />
 */
export function PageHeader({
  title,
  accent,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  const marked = accent && title.includes(accent)

  return (
    <div className={mergeClasses(baseRoot, className)}>
      {breadcrumb}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={titleClass}>
            {marked ? (
              <>
                {title.replace(accent, '').trimEnd()}{' '}
                <span className={accentClass}>{accent}</span>
              </>
            ) : (
              title
            )}
          </h1>
          {description && <p className={descriptionClass}>{description}</p>}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  )
}

PageHeader.displayName = 'PageHeader'
