import { useEffect, useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import styles from './Tokens.stories.module.css'

type Token = {
  name: string
  label?: string
  cssName?: string
  multiplier?: number
}

const colorTokens: Token[] = [
  { name: '--color-brand' },
  { name: '--color-brand-light' },
  { name: '--color-brand-strong' },
  { name: '--color-brand-hover' },
  { name: '--color-brand-active' },
  { name: '--color-brand-ghost' },
  { name: '--color-brand-soft' },
  { name: '--color-brand-muted' },
  { name: '--color-brand-bold' },
  { name: '--color-brand-vivid' },
  { name: '--color-surface-page' },
  { name: '--color-surface-raised' },
  { name: '--color-surface-1' },
  { name: '--color-surface-2' },
  { name: '--color-surface-3' },
  { name: '--color-surface-4' },
  { name: '--color-surface-5' },
  { name: '--color-surface-6' },
  { name: '--color-surface-cool' },
  { name: '--color-surface-mute' },
  { name: '--color-border' },
  { name: '--color-fg-strong' },
  { name: '--color-fg-default' },
  { name: '--color-fg-muted' },
  { name: '--color-fg-subtle' },
  { name: '--color-fg-faint' },
  { name: '--color-fg-faintest' },
  { name: '--color-fg-cool' },
  { name: '--color-fg-inverse' },
  { name: '--color-fg-ghost' },
  { name: '--color-accent-peach-light' },
  { name: '--color-accent-peach' },
  { name: '--color-accent-peach-deep' },
  { name: '--color-accent-lime' },
  { name: '--color-accent-clay' },
  { name: '--color-accent-whatsapp' },
  { name: '--color-success' },
  { name: '--color-success-surface' },
  { name: '--color-danger' },
  { name: '--color-danger-surface' },
  { name: '--color-warning' },
  { name: '--color-warning-surface' },
  { name: '--color-warning-bright' },
  { name: '--color-input-border' },
  { name: '--color-input-border-focus' },
  { name: '--color-warm-50', label: 'primitive · warm' },
  { name: '--color-warm-100', label: 'primitive · warm' },
  { name: '--color-warm-200', label: 'primitive · warm' },
  { name: '--color-warm-300', label: 'primitive · warm' },
  { name: '--color-warm-400', label: 'primitive · warm' },
  { name: '--color-warm-500', label: 'primitive · warm' },
  { name: '--color-warm-600', label: 'primitive · warm' },
  { name: '--color-warm-700', label: 'primitive · warm' },
  { name: '--color-warm-750', label: 'primitive · warm' },
  { name: '--color-warm-800', label: 'primitive · warm' },
  { name: '--color-warm-900', label: 'primitive · warm' },
  { name: '--color-warm-950', label: 'primitive · warm' },
  { name: '--color-burnt-900', label: 'primitive · burnt' },
  { name: '--color-cool-100', label: 'primitive · cool' },
  { name: '--color-cool-900', label: 'primitive · cool' },
  { name: '--color-peach-100', label: 'primitive · peach' },
  { name: '--color-peach-200', label: 'primitive · peach' },
  { name: '--color-peach-300', label: 'primitive · peach' },
  { name: '--color-clay-500', label: 'primitive' },
  { name: '--color-whatsapp-500', label: 'primitive' },
]

const colorGroups: { title: string; description: string; tokens: Token[] }[] = [
  {
    title: 'Primitives',
    description:
      'A tinta-base da paleta. Componentes devem preferir os semânticos abaixo.',
    tokens: colorTokens.filter((token) => token.label?.startsWith('primitive')),
  },
  {
    title: 'Brand',
    description: 'Marca, estados de interação e contraste sobre a marca.',
    tokens: colorTokens.filter(
      (token) =>
        token.name.includes('brand') || token.name === '--color-fg-on-brand'
    ),
  },
  {
    title: 'Surfaces',
    description: 'Do papel da página às superfícies que se elevam sobre ele.',
    tokens: colorTokens.filter((token) => token.name.includes('surface')),
  },
  {
    title: 'Content',
    description: 'Texto, ícones e bordas organizados por contraste e função.',
    tokens: colorTokens.filter(
      (token) =>
        (token.name.includes('fg-') && token.name !== '--color-fg-on-brand') ||
        token.name === '--color-border'
    ),
  },
  {
    title: 'Feedback',
    description: 'Estados que comunicam sucesso, erro e atenção.',
    tokens: colorTokens.filter((token) =>
      ['success', 'danger', 'warning'].some((status) =>
        token.name.includes(status)
      )
    ),
  },
  {
    title: 'Accents',
    description: 'Acentos expressivos para destacar informação e identidade.',
    tokens: colorTokens.filter((token) => token.name.includes('accent')),
  },
  {
    title: 'Charts',
    description:
      'Cores de séries: identidade visual, não significado de status.',
    tokens: [
      { name: '--color-chart-1' },
      { name: '--color-chart-2' },
      { name: '--color-chart-3' },
      { name: '--color-chart-4' },
    ],
  },
  {
    title: 'Fields',
    description: 'Contornos de campos em repouso e no foco.',
    tokens: colorTokens.filter((token) => token.name.includes('input')),
  },
]

const typographyTokens: Token[] = [
  { name: '--font-sans' },
  { name: '--font-display' },
  { name: '--text-3xs' },
  { name: '--text-2xs' },
  { name: '--tracking-snug' },
  { name: '--tracking-caps' },
  { name: '--tracking-logo' },
  { name: '--leading-display' },
]

const spacingTokens: Token[] = [
  1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96,
].map((multiplier) => ({
  name: `--spacing × ${multiplier}`,
  cssName: '--spacing',
  multiplier,
  label: `escala · ${multiplier} × 0.25rem`,
}))

const radiusTokens: Token[] = [1, 2, 3, 4, 5, 6].map((step) => ({
  name: `--radius-${step}`,
}))

const elevationTokens: Token[] = [
  { name: '--shadow-up' },
  { name: '--shadow-warm-sm' },
  { name: '--shadow-warm-md' },
  { name: '--shadow-warm-lg' },
  { name: '--shadow-brand' },
  { name: '--shadow-brand-lg' },
]

const opacityTokens: Token[] = [
  { name: '--opacity-watermark' },
  { name: '--opacity-faint' },
  { name: '--opacity-disabled' },
  { name: '--opacity-dim' },
  { name: '--opacity-strong' },
]

const motionTokens: Token[] = [
  { name: '--ease-out-soft', label: 'desacelera sem passar do ponto' },
  { name: '--ease-back', label: 'passa do ponto e volta' },
  { name: '--duration-fast', label: 'troca rápida · 150ms' },
  { name: '--duration-base', label: 'ritmo padrão · 200ms' },
  { name: '--duration-slow', label: 'mudança gradual · 300ms' },
  { name: '--duration-slower', label: 'movimento longo · 460ms' },
]

const layoutTokens: Token[] = [
  { name: '--container-page' },
  { name: '--container-page-narrow' },
  { name: '--container-block' },
  { name: '--container-block-lg' },
  { name: '--container-block-md' },
  { name: '--container-block-sm' },
  { name: '--width-sidebar-collapsed' },
  { name: '--z-below' },
  { name: '--z-base' },
  { name: '--z-raised' },
  { name: '--z-content' },
  { name: '--z-sticky' },
  { name: '--z-dock' },
  { name: '--z-nav' },
  { name: '--z-overlay' },
  { name: '--z-modal' },
  { name: '--z-popover' },
  { name: '--z-toast' },
  { name: '--z-grain' },
]

const readToken = (name: string) =>
  typeof document === 'undefined'
    ? ''
    : getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const copyToken = async (name: string, value: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(`${name}: ${value}`)
  }
}

const TokenCard = ({
  name,
  label,
  cssName,
  multiplier,
  kind,
}: Token & { kind: string }) => {
  const [value, setValue] = useState('')
  const [copied, setCopied] = useState(false)
  const [isMotionActive, setIsMotionActive] = useState(false)
  const tokenName = cssName ?? name
  const displayedValue = multiplier
    ? `calc(${tokenName} * ${multiplier})`
    : value

  useEffect(() => {
    setValue(readToken(tokenName))
  }, [tokenName])

  const handleCopy = async () => {
    await copyToken(name, displayedValue)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  const sampleStyle =
    kind === 'color'
      ? { backgroundColor: `var(${name})` }
      : kind === 'spacing'
        ? { width: `calc(var(${tokenName}) * ${multiplier})`, height: '1.5rem' }
        : kind === 'radius'
          ? { borderRadius: `var(${name})` }
          : kind === 'elevation'
            ? { boxShadow: `var(${name})` }
            : kind === 'opacity'
              ? { opacity: `var(${name})` }
              : kind === 'motion' && name.startsWith('--ease-')
                ? { transition: `transform 1100ms var(${name})` }
                : kind === 'motion' && name.startsWith('--duration-')
                  ? {
                      transition: `transform var(${name}) var(--ease-out)`,
                    }
                  : kind === 'typography' && name.startsWith('--font-')
                    ? { fontFamily: `var(${name})` }
                    : kind === 'typography' && name.startsWith('--text-')
                      ? { fontSize: `var(${name})` }
                      : kind === 'typography' && name.startsWith('--tracking-')
                        ? { letterSpacing: `var(${name})` }
                        : kind === 'typography' && name.startsWith('--leading-')
                          ? { lineHeight: `var(${name})` }
                          : undefined

  return (
    <article className={styles.card}>
      <div
        aria-hidden="true"
        className={styles.sample}
        onMouseEnter={() => setIsMotionActive(true)}
        onMouseLeave={() => setIsMotionActive(false)}
        style={{
          width: kind === 'spacing' ? undefined : '100%',
          maxWidth: '100%',
          minHeight: kind === 'spacing' ? '1.5rem' : '4rem',
          border: '1px solid var(--color-border)',
          backgroundColor:
            kind === 'color' ? `var(${name})` : 'var(--color-surface-2)',
          ...sampleStyle,
        }}
      >
        {kind === 'typography' && 'Aa Bb Cc 123'}
        {kind === 'motion' && (
          <span className={styles.motionTrack}>
            <span
              className={styles.motionObject}
              style={{
                ...sampleStyle,
                transform: isMotionActive ? 'translateX(7rem)' : undefined,
              }}
            >
              →
            </span>
          </span>
        )}
        {kind === 'layout' && value}
        {kind === 'opacity' && 'Amostra'}
      </div>
      <div>
        <code className={styles.name}>{name}</code>
        {label && <span className={styles.label}>{label}</span>}
        <span className={styles.value}>{displayedValue || 'não definido'}</span>
      </div>
      <button type="button" className={styles.copy} onClick={handleCopy}>
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </article>
  )
}

const TokenSection = ({
  title,
  description,
  tokens,
  kind,
}: {
  title: string
  description: string
  tokens: Token[]
  kind: string
}) => (
  <section className={styles.section}>
    <div className={styles.sectionHeading}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
    </div>
    <div className={styles.grid}>
      {tokens.map((token) => (
        <TokenCard key={token.name} {...token} kind={kind} />
      ))}
    </div>
  </section>
)

const ColorGroup = ({
  title,
  description,
  tokens,
}: {
  title: string
  description: string
  tokens: Token[]
}) => (
  <section className={styles.colorGroup}>
    <div className={styles.sectionHeading}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
    </div>
    <div className={styles.colorGrid}>
      {tokens.map((token) => (
        <TokenCard key={token.name} {...token} kind="color" />
      ))}
    </div>
  </section>
)

const meta: Meta = {
  title: 'Tokens',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
}

export default meta
type Story = StoryObj

const renderCategory = (
  title: string,
  description: string,
  tokens: Token[],
  kind: string
) => (
  <main className={styles.page}>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>Nino Design System · Tokens</p>
      <h1 className={styles.title}>{title}</h1>
    </header>
    <TokenSection
      title={title}
      description={description}
      tokens={tokens}
      kind={kind}
    />
  </main>
)

const renderColorCategory = () => (
  <main className={styles.page}>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>Nino Design System · Tokens</p>
      <h1 className={styles.title}>Colors</h1>
      <p className={styles.heroDescription}>
        Uma paleta com papéis claros: comece pelo significado, não pelo valor da
        cor.
      </p>
    </header>
    {colorGroups.map((group) => (
      <ColorGroup key={group.title} {...group} />
    ))}
  </main>
)

export const Colors: Story = {
  render: renderColorCategory,
}

export const Typography: Story = {
  render: () =>
    renderCategory(
      'Tipografia',
      'Famílias, tamanhos, entrelinha e espaçamento entre letras.',
      typographyTokens,
      'typography'
    ),
}

export const Spacing: Story = {
  render: () =>
    renderCategory(
      'Espaçamento',
      'Escala usada por padding, margin e gap.',
      spacingTokens,
      'spacing'
    ),
}

export const Radius: Story = {
  render: () =>
    renderCategory(
      'Radius',
      'Raios estruturais para superfícies e controles.',
      radiusTokens,
      'radius'
    ),
}

export const Elevation: Story = {
  render: () =>
    renderCategory(
      'Elevação',
      'Sombras neutras, quentes e halos de marca.',
      elevationTokens,
      'elevation'
    ),
}

export const Opacity: Story = {
  render: () =>
    renderCategory(
      'Opacidade',
      'Níveis nomeados por intenção visual.',
      opacityTokens,
      'opacity'
    ),
}

export const Motion: Story = {
  render: () =>
    renderCategory(
      'Motion',
      'Passe o mouse sobre cada amostra para comparar a curva ou a duração.',
      motionTokens,
      'motion'
    ),
}

export const LayoutAndLayers: Story = {
  render: () =>
    renderCategory(
      'Layout e camadas',
      'Containers, largura estrutural e níveis de empilhamento.',
      layoutTokens,
      'layout'
    ),
}
