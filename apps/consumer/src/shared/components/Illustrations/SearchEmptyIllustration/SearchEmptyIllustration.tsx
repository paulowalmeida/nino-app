import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const SearchEmptyIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    aria-hidden="true"
    {...props}
    className={[styles.illustration, props.className].filter(Boolean).join(' ')}
  >
    <path
      d="M30 84c0-34 28-58 62-56 20 1 30 12 50 10 24-2 38 18 34 44-4 32-30 50-66 52-40 2-80-14-80-50Z"
      fill="var(--ill-ghost)"
    />
    <ellipse cx="96" cy="138" rx="60" ry="6" fill="var(--ill-soft)" />
    <ellipse cx="96" cy="122" rx="56" ry="16" fill="var(--ill-soft)" />
    <ellipse
      cx="96"
      cy="118"
      rx="56"
      ry="16"
      fill="var(--color-surface-page)"
      stroke="var(--ill-soft)"
      strokeWidth="2"
    />
    <ellipse
      cx="96"
      cy="118"
      rx="36"
      ry="9"
      stroke="var(--ill-soft)"
      strokeWidth="2"
      strokeDasharray="4 5"
    />
    <circle cx="84" cy="118" r="2" fill="var(--ill-muted)" />
    <circle cx="106" cy="114" r="1.5" fill="var(--ill-muted)" />
    <path
      d="M24 92v40M18 92v12a6 6 0 0 0 12 0V92"
      stroke="var(--ill-main)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M172 132V92c-7 4-8 16-6 24h6"
      stroke="var(--ill-main)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g transform="rotate(-14 112 64)">
      <path
        d="m126 78 15 15"
        stroke="var(--color-fg-strong)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle
        cx="112"
        cy="64"
        r="21"
        fill="var(--ill-ghost)"
        stroke="var(--color-fg-strong)"
        strokeWidth="5"
      />
      <path
        d="M104 64h16"
        stroke="var(--ill-main)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M101 56a12 12 0 0 1 8-6"
        stroke="var(--color-surface-page)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
    <path d="M58 40l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="var(--ill-main)" />
    <path
      d="M160 46l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5Z"
      fill="var(--ill-muted)"
    />
    <circle cx="148" cy="24" r="2.5" fill="var(--ill-muted)" />
    <circle cx="40" cy="62" r="2.5" fill="var(--ill-muted)" />
  </svg>
)
