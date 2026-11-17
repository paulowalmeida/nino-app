import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const MenuEmptyIllustration = ({
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
      d="M164 338C183 263 264 257 319 204C375 150 438 133 502 154C565 175 621 145 685 181C748 216 751 281 797 335C844 391 853 455 816 510C780 565 721 581 671 620C612 665 548 647 484 653C413 661 355 669 294 634C235 600 219 553 178 514C137 474 146 405 164 338Z"
    />
    <ellipse cx="500" cy="630" rx="270" ry="28" fill="var(--ill-soft)" />
    <g transform="rotate(-4 500 425)">
      <path
        fill="var(--ill-main)"
        d="M330 242Q412 231 500 264Q588 231 670 242Q685 244 685 259V594Q685 610 669 607Q578 590 500 620Q422 590 331 607Q315 610 315 594V259Q315 244 330 242Z"
      />
      <path
        fill="#fff"
        d="M344 260Q421 255 500 283V597Q424 572 344 583Q337 584 337 576V269Q337 261 344 260Z"
      />
      <path
        fill="#fff"
        d="M656 260Q579 255 500 283V597Q576 572 656 583Q663 584 663 576V269Q663 261 656 260Z"
      />
      <path
        fill="var(--ill-soft)"
        d="M492 280L500 283L508 280V595L500 597L492 595Z"
      />
      <rect
        x="365"
        y="330"
        width="98"
        height="18"
        rx="9"
        fill="var(--ill-soft)"
      />
      <rect
        x="365"
        y="374"
        width="74"
        height="18"
        rx="9"
        fill="var(--ill-soft)"
      />
      <rect
        x="537"
        y="330"
        width="98"
        height="18"
        rx="9"
        fill="var(--ill-soft)"
      />
      <rect
        x="537"
        y="374"
        width="74"
        height="18"
        rx="9"
        fill="var(--ill-soft)"
      />
      <path
        fill="var(--ill-muted)"
        d="M232 333Q225 333 225 341V393Q225 416 245 423V558Q245 570 257 570Q269 570 269 558V423Q289 416 289 393V341Q289 333 282 333Q275 333 275 341V383H264V341Q264 333 257 333Q250 333 250 341V383H239V341Q239 333 232 333Z"
      />
      <path
        fill="var(--ill-muted)"
        d="M762 333C737 338 719 371 719 416V438Q719 448 730 448H751V558Q751 570 763 570Q775 570 775 558V345Q775 332 762 333Z"
      />
    </g>
    <g fill="var(--ill-main)">
      <path d="M214 239Q219 260 240 265Q219 270 214 291Q209 270 188 265Q209 260 214 239Z" />
      <path d="M803 492Q807 511 826 515Q807 519 803 538Q799 519 780 515Q799 511 803 492Z" />
      <path d="M318 646Q321 660 335 663Q321 666 318 680Q315 666 301 663Q315 660 318 646Z" />
    </g>
    <g fill="var(--ill-light)">
      <circle cx="176" cy="473" r="8" />
      <circle cx="745" cy="224" r="7" />
      <circle cx="706" cy="659" r="7" />
    </g>
    <g stroke="var(--color-fg-strong)" strokeWidth="8" strokeLinecap="round">
      <path d="M454 210L448 187" />
      <path d="M491 204V179" />
      <path d="M528 210L537 187" />
    </g>
  </svg>
)
