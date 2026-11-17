import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const ErrorIllustration = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 1000 800"
    fill="none"
    aria-hidden="true"
    {...props}
    className={[styles.illustration, className].filter(Boolean).join(' ')}
  >
    <path
      fill="var(--ill-ghost)"
      d="M145 371C163 302 229 277 284 229C338 182 402 159 466 179C527 198 585 164 647 189C709 214 730 266 783 300C837 335 868 387 846 441C825 493 856 537 815 580C771 626 715 623 659 650C601 678 542 653 484 667C420 682 357 660 309 631C259 601 203 615 165 570C128 526 127 470 135 424Q140 390 145 371Z"
    />
    <ellipse cx="503" cy="554" rx="230" ry="26" fill="var(--ill-soft)" />

    <g transform="rotate(-6 500 410)">
      <path
        d="M104 471C129 549 238 566 260 500C280 441 164 369 214 324C250 292 291 335 291 407C291 335 250 292 214 324C164 369 280 441 260 500C238 566 129 549 104 471"
        fill="var(--ill-main)"
        stroke="var(--ill-main)"
        strokeWidth="23"
        strokeLinecap="round"
      />
      <path
        d="M709 407C709 479 753 529 790 495C839 451 727 373 750 317C774 258 865 283 895 348C865 283 774 258 750 317C727 373 839 451 790 495C753 529 709 479 709 407"
        fill="var(--ill-main)"
        stroke="var(--ill-main)"
        strokeWidth="23"
        strokeLinecap="round"
      />
      <rect
        x="265"
        y="383"
        width="65"
        height="48"
        rx="19"
        fill="var(--ill-muted)"
      />
      <g fill="var(--ill-main)">
        <rect x="277" y="385" width="6" height="44" rx="3" />
        <rect x="291" y="383" width="6" height="48" rx="3" />
        <rect x="305" y="383" width="6" height="48" rx="3" />
      </g>
      <rect
        x="426"
        y="367"
        width="64"
        height="20"
        rx="5"
        fill="var(--ill-strong)"
      />
      <rect x="426" y="367" width="60" height="15" rx="4" fill="#fff" />
      <rect
        x="426"
        y="426"
        width="64"
        height="20"
        rx="5"
        fill="var(--ill-strong)"
      />
      <rect x="426" y="426" width="60" height="15" rx="4" fill="#fff" />
      <circle cx="472" cy="374" r="3" fill="var(--ill-light)" />
      <circle cx="472" cy="433" r="3" fill="var(--ill-light)" />
      <path
        fill="var(--ill-main)"
        d="M340 342H419Q442 342 442 365V449Q442 472 419 472H340Q314 472 306 450Q299 429 299 407Q299 384 306 364Q314 342 340 342Z"
      />
      <rect
        x="413"
        y="342"
        width="29"
        height="130"
        rx="12"
        fill="var(--ill-muted)"
      />
      <g fill="var(--ill-muted)">
        <rect x="326" y="372" width="8" height="70" rx="4" />
        <rect x="344" y="372" width="8" height="70" rx="4" />
      </g>
      <circle cx="386" cy="407" r="9" fill="var(--ill-light)" />
      <path
        d="M383 410L389 404"
        stroke="var(--color-fg-strong)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="671"
        y="383"
        width="65"
        height="48"
        rx="19"
        fill="var(--ill-muted)"
      />
      <g fill="var(--ill-main)">
        <rect x="689" y="383" width="6" height="48" rx="3" />
        <rect x="703" y="383" width="6" height="48" rx="3" />
        <rect x="717" y="385" width="6" height="44" rx="3" />
      </g>
      <path
        fill="var(--ill-main)"
        d="M578 342H661Q686 342 694 364Q701 384 701 407Q701 429 694 450Q686 472 661 472H578Q555 472 555 449V365Q555 342 578 342Z"
      />
      <rect
        x="555"
        y="342"
        width="64"
        height="130"
        rx="23"
        fill="var(--ill-light)"
      />
      <rect
        x="571"
        y="366"
        width="27"
        height="19"
        rx="5"
        fill="var(--color-fg-strong)"
      />
      <rect
        x="571"
        y="429"
        width="27"
        height="19"
        rx="5"
        fill="var(--color-fg-strong)"
      />
      <circle cx="585" cy="407" r="7" fill="var(--ill-muted)" />
      <path
        d="M582 407H588"
        stroke="var(--color-fg-strong)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g fill="var(--ill-muted)">
        <rect x="644" y="372" width="8" height="70" rx="4" />
        <rect x="662" y="372" width="8" height="70" rx="4" />
      </g>
      <g stroke="var(--color-fg-strong)" strokeWidth="7" strokeLinecap="round">
        <path d="M516 389L510 376" />
        <path d="M525 406H538" />
        <path d="M516 423L510 436" />
      </g>
    </g>

    <g fill="var(--ill-main)">
      <path d="M243 229Q247 248 266 252Q247 256 243 275Q239 256 220 252Q239 248 243 229Z" />
      <path d="M766 550Q769 563 782 566Q769 569 766 582Q763 569 750 566Q763 563 766 550Z" />
    </g>
    <g fill="var(--ill-light)">
      <circle cx="637" cy="226" r="8" />
      <circle cx="184" cy="590" r="6" />
      <circle cx="819" cy="416" r="7" />
    </g>
  </svg>
)
