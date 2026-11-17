import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const CouponsEmptyIllustration = ({
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
      d="M160 332C177 254 257 252 317 197C381 138 463 116 535 145C606 173 646 153 710 184C777 217 778 284 819 337C866 397 873 465 832 521C787 581 722 592 657 628C584 668 501 650 435 663C355 679 278 651 231 604C182 555 124 529 126 460C127 411 149 383 160 332Z"
    />
    <ellipse cx="500" cy="621" rx="281" ry="31" fill="var(--ill-soft)" />
    <g transform="rotate(-9 500 410)">
      <path
        fill="var(--ill-main)"
        d="M256 251Q276 277 296 251Q316 277 336 251Q356 277 376 251Q396 277 416 251Q436 277 456 251Q476 277 496 251Q516 277 536 251Q556 277 576 251Q596 277 616 251Q636 277 656 251Q676 277 696 251Q716 277 736 251Q748 251 748 267V368C700 368 700 432 748 432V537Q748 551 736 551Q716 525 696 551Q676 525 656 551Q636 525 616 551Q596 525 576 551Q556 525 536 551Q516 525 496 551Q476 525 456 551Q436 525 416 551Q396 525 376 551Q356 525 336 551Q316 525 296 551Q276 525 256 551Q242 551 242 537V432C290 432 290 368 242 368V267Q242 251 256 251Z"
      />
      <path
        fill="var(--ill-muted)"
        d="M256 251Q276 277 296 251Q316 277 336 251Q356 277 376 251Q396 277 416 251Q436 277 456 251Q476 277 496 251Q516 277 536 251Q556 277 576 251Q596 277 616 251Q636 277 656 251Q676 277 696 251Q716 277 736 251Q748 251 748 267V297H242V267Q242 251 256 251Z"
      />
      <path
        fill="var(--ill-strong)"
        d="M242 505H748V537Q748 551 736 551Q716 525 696 551Q676 525 656 551Q636 525 616 551Q596 525 576 551Q556 525 536 551Q516 525 496 551Q476 525 456 551Q436 525 416 551Q396 525 376 551Q356 525 336 551Q316 525 296 551Q276 525 256 551Q242 551 242 537Z"
      />
      <g fill="var(--ill-soft)">
        <rect x="635" y="316" width="8" height="22" rx="4" />
        <rect x="635" y="354" width="8" height="22" rx="4" />
        <rect x="635" y="392" width="8" height="22" rx="4" />
        <rect x="635" y="430" width="8" height="22" rx="4" />
        <rect x="635" y="468" width="8" height="18" rx="4" />
      </g>
      <g fill="#fff">
        <circle cx="426" cy="355" r="23" />
        <circle cx="520" cy="448" r="23" />
        <rect
          x="458"
          y="324"
          width="26"
          height="156"
          rx="13"
          transform="rotate(36 471 402)"
        />
      </g>
    </g>
    <g fill="var(--ill-main)">
      <path d="M215 211Q220 233 242 238Q220 243 215 265Q210 243 188 238Q210 233 215 211Z" />
      <path d="M806 467Q810 486 829 490Q810 494 806 513Q802 494 783 490Q802 486 806 467Z" />
      <path d="M275 574Q278 588 292 591Q278 594 275 608Q272 594 258 591Q272 588 275 574Z" />
    </g>
    <g fill="var(--ill-light)">
      <circle cx="165" cy="461" r="8" />
      <circle cx="756" cy="199" r="8" />
      <circle cx="711" cy="614" r="6" />
    </g>
    <g stroke="var(--color-fg-strong)" strokeWidth="8" strokeLinecap="round">
      <path d="M614 180L618 157" />
      <path d="M649 187L665 168" />
      <path d="M674 211L697 203" />
    </g>
  </svg>
)
