import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const AddressesEmptyIllustration = ({
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
      d="M167 347C182 278 249 262 302 210C361 153 422 125 489 145C555 165 599 139 664 165C735 193 752 254 796 305C844 360 868 419 837 478C808 535 757 557 706 605C651 656 581 666 510 648C440 630 395 668 322 648C250 628 222 576 180 533C132 484 145 415 167 347Z"
    />
    <ellipse cx="500" cy="651" rx="277" ry="30" fill="var(--ill-soft)" />
    <g transform="rotate(-9 500 535)">
      <rect
        x="245"
        y="419"
        width="510"
        height="222"
        rx="29"
        fill="var(--ill-light)"
      />
      <rect
        x="245"
        y="407"
        width="510"
        height="222"
        rx="29"
        fill="var(--ill-muted)"
      />
      <path
        fill="var(--ill-ghost)"
        d="M370 407H414V492H755V532H414V629H370V532H245V492H370Z"
      />
      <rect
        x="459"
        y="554"
        width="94"
        height="49"
        rx="10"
        fill="var(--ill-soft)"
      />
    </g>
    <ellipse cx="504" cy="539" rx="55" ry="15" fill="var(--ill-strong)" />
    <path
      fill="var(--ill-main)"
      d="M500 205C422 205 365 262 365 335C365 407 440 488 488 535Q500 547 512 535C560 488 635 407 635 335C635 262 578 205 500 205Z"
    />
    <circle cx="500" cy="333" r="53" fill="#fff" />
    <g fill="var(--ill-main)">
      <path d="M251 243Q256 263 276 268Q256 273 251 293Q246 273 226 268Q246 263 251 243Z" />
      <path d="M778 363Q782 381 800 385Q782 389 778 407Q774 389 756 385Q774 381 778 363Z" />
      <path d="M205 541Q208 554 221 557Q208 560 205 573Q202 560 189 557Q202 554 205 541Z" />
    </g>
    <g fill="var(--ill-light)">
      <circle cx="317" cy="177" r="7" />
      <circle cx="814" cy="534" r="8" />
      <circle cx="710" cy="677" r="6" />
    </g>
    <g stroke="var(--color-fg-strong)" strokeWidth="8" strokeLinecap="round">
      <path d="M649 239L664 217" />
      <path d="M672 266L696 253" />
      <path d="M683 298L709 296" />
    </g>
  </svg>
)
