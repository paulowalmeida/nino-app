import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const OrdersEmptyIllustration = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="100 160 1160 860"
    fill="none"
    aria-hidden="true"
    {...props}
    className={[styles.illustration, className].filter(Boolean).join(' ')}
  >
    <path
      fill="var(--ill-wash)"
      d="M258 400C262 300 330 176 490 172C610 170 680 244 748 242C820 240 860 206 920 206C1030 206 1102 300 1098 410C1094 480 1150 520 1190 570C1240 630 1262 690 1254 740C1240 850 1130 930 960 962C820 990 700 1012 560 1006C420 1000 300 960 220 880C150 810 100 740 112 660C124 560 258 500 258 400Z"
    />
    <ellipse cx="688" cy="877" rx="362" ry="43" fill="var(--ill-light)" />
    <path
      fill="var(--ill-muted)"
      d="M489 430C470 520 420 700 396 852C394 872 410 882 438 880L440 872Z"
    />
    <path
      fill="#fff"
      d="M489 432H833L810 600L770 850L760 866L722 832L683 866L645 832L606 866L568 832L528 866L490 832L440 872Z"
    />
    <path
      fill="var(--ill-main)"
      d="M442 368Q456 362 476 362H776Q834 364 833 430V440H489Z"
    />
    <path
      fill="var(--ill-strong)"
      d="M402 478Q398 396 442 370Q484 358 489 412L472 478Z"
    />
    <g fill="var(--ill-soft)">
      <rect x="526" y="517" width="245" height="42" rx="21" />
      <rect x="509" y="611" width="249" height="41" rx="20" />
      <rect x="495" y="704" width="230" height="41" rx="20" />
    </g>
    <circle
      cx="878"
      cy="753"
      r="126"
      fill="#fff"
      stroke="var(--ill-main)"
      strokeWidth="28"
    />
    <path
      d="M880 676V752L940 792"
      stroke="var(--color-fg-strong)"
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="879" cy="752" r="17" fill="var(--ill-main)" />
    <path
      d="M837 290L824 326M889 318L854 347M871 379L906 376"
      stroke="var(--color-fg-strong)"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <g fill="var(--ill-main)">
      <path
        transform="translate(425 290)"
        d="M0-36C3-14 14-3 36 0C14 3 3 14 0 36C-3 14-14 3-36 0C-14-3-3-14 0-36Z"
      />
      <path
        transform="translate(994 490)"
        d="M0-36C3-14 14-3 36 0C14 3 3 14 0 36C-3 14-14 3-36 0C-14-3-3-14 0-36Z"
      />
      <path
        transform="translate(296 680) scale(.8)"
        d="M0-36C3-14 14-3 36 0C14 3 3 14 0 36C-3 14-14 3-36 0C-14-3-3-14 0-36Z"
      />
      <circle cx="330" cy="520" r="14" />
      <circle cx="1081" cy="621" r="12" />
    </g>
  </svg>
)
