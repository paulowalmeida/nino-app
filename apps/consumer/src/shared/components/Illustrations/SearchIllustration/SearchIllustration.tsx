import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const SearchIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    aria-hidden="true"
    {...props}
    className={[styles.illustration, props.className].filter(Boolean).join(' ')}
  >
    <path
      d="M38 92c-6-30 14-58 46-64 26-5 44 6 62 4 22-2 40 16 38 42-2 30-22 52-56 58-36 6-84-6-90-40Z"
      fill="var(--ill-ghost)"
    />
    <ellipse cx="94" cy="142" rx="54" ry="5" fill="var(--ill-soft)" />
    <path
      d="M70 52c-4 6 4 10 0 16M88 46c-4 7 4 12 0 20M106 52c-4 6 4 10 0 16"
      stroke="var(--ill-muted)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M58 100c4-14 18-22 34-20 16-2 30 6 34 20Z"
      fill="var(--ill-soft)"
    />
    <circle cx="80" cy="92" r="5" fill="var(--ill-light)" />
    <circle cx="100" cy="88" r="4" fill="var(--ill-light)" />
    <path
      d="M48 100h88c0 22-18 38-44 38s-44-16-44-38Z"
      fill="var(--ill-main)"
    />
    <path
      d="M56 108c4 10 14 18 26 21"
      stroke="var(--color-fg-on-brand)"
      strokeOpacity=".45"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="m152 84 16 16"
      stroke="var(--color-fg-strong)"
      strokeWidth="9"
      strokeLinecap="round"
    />
    <circle
      cx="140"
      cy="70"
      r="20"
      fill="var(--color-surface-page)"
      stroke="var(--color-fg-strong)"
      strokeWidth="5"
    />
    <path
      d="M130 64a11 11 0 0 1 8-6"
      stroke="var(--ill-soft)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path d="M44 42l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="var(--ill-main)" />
    <path
      d="M168 34l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5Z"
      fill="var(--ill-muted)"
    />
    <circle cx="176" cy="118" r="3" fill="var(--ill-muted)" />
    <circle cx="30" cy="120" r="2.5" fill="var(--ill-main)" />
  </svg>
)
