import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const UpdatesEmptyIllustration = ({
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
      d="M164 367C179 300 245 277 296 226C347 176 411 153 474 174C535 194 592 160 654 188C715 216 731 274 781 310C833 348 857 401 836 455C816 506 844 546 804 588C761 633 705 630 650 655C594 680 536 657 478 669C413 682 355 660 308 630C261 600 205 611 168 568C133 526 136 473 145 427Q153 389 164 367Z"
    />
    <ellipse cx="452" cy="599" rx="227" ry="29" fill="var(--ill-soft)" />
    <path
      fill="var(--ill-light)"
      d="M624 209H733Q778 209 778 254V301Q778 342 737 342H661C648 359 633 370 613 376Q607 378 610 371Q619 352 619 341C592 338 579 324 579 298V254Q579 209 624 209Z"
    />
    <path
      fill="var(--ill-strong)"
      d="M245 558C245 533 338 515 452 515C566 515 659 533 659 558V570C659 594 566 612 452 612C338 612 245 594 245 570Z"
    />
    <ellipse cx="452" cy="556" rx="207" ry="39" fill="var(--ill-main)" />
    <ellipse cx="452" cy="550" rx="179" ry="27" fill="var(--ill-muted)" />
    <rect
      x="440"
      y="325"
      width="24"
      height="43"
      rx="7"
      fill="var(--ill-main)"
    />
    <rect
      x="415"
      y="311"
      width="74"
      height="24"
      rx="12"
      fill="var(--ill-light)"
    />
    <path
      fill="var(--ill-muted)"
      d="M416 326H488Q485 335 477 335H427Q419 335 416 326Z"
    />
    <path
      fill="var(--ill-muted)"
      d="M284 536C284 433 355 350 452 350C549 350 620 433 620 536Q620 549 607 552C522 570 382 570 297 552Q284 549 284 536Z"
    />
    <ellipse cx="452" cy="357" rx="27" ry="7" fill="var(--ill-main)" />
    <path
      fill="var(--ill-main)"
      d="M286 520C365 541 539 541 618 520L620 536Q620 549 607 552C522 570 382 570 297 552Q284 549 284 536Z"
    />
    <path
      fill="var(--ill-light)"
      d="M285 519C365 539 539 539 619 519V527C539 547 365 547 285 527Z"
    />
    <circle cx="305" cy="558" r="6" fill="var(--ill-light)" />
    <circle cx="599" cy="558" r="6" fill="var(--ill-light)" />
    <g stroke="var(--color-fg-strong)" strokeWidth="2.5" strokeLinecap="round">
      <path d="M302 558H308" />
      <path d="M596 558H602" />
    </g>

    <g fill="var(--ill-main)">
      <path d="M264 252Q268 271 287 275Q268 279 264 298Q260 279 241 275Q260 271 264 252Z" />
      <path d="M749 506Q752 519 765 522Q752 525 749 538Q746 525 733 522Q746 519 749 506Z" />
    </g>
    <g fill="var(--ill-light)">
      <circle cx="427" cy="227" r="7" />
      <circle cx="197" cy="460" r="8" />
      <circle cx="700" cy="626" r="6" />
    </g>
  </svg>
)
