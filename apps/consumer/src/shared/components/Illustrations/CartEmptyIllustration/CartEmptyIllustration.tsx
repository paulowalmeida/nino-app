import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const CartEmptyIllustration = ({
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
      d="M156 324C193 271 269 265 325 210C382 154 459 101 539 99C628 96 687 133 698 207C706 267 746 274 806 303C872 335 910 388 884 444C859 504 792 525 738 564C681 606 618 649 537 650C446 652 396 621 322 625C244 629 151 606 119 545C84 479 109 390 156 324Z"
    />
    <ellipse cx="500" cy="690" rx="310" ry="39" fill="var(--ill-soft)" />
    <path
      fill="var(--ill-main)"
      d="M620 344L688 284L730 638Q733 647 724 653L653 695L620 674Z"
    />
    <path
      fill="var(--ill-muted)"
      d="M271 322L620 344L653 684Q655 701 638 701L256 681Q238 680 240 662Z"
    />
    <path
      fill="var(--ill-light)"
      d="M271 314L375 255L683 274Q691 274 688 284L620 351L278 333Q267 333 271 314Z"
    />
    <path fill="var(--ill-strong)" d="M287 321L377 265L675 283L615 341Z" />
    <path fill="var(--ill-main)" d="M377 265L675 283L615 341L380 329Z" />
    <path
      d="M361 378C359 513 532 530 535 388"
      stroke="var(--color-fg-strong)"
      strokeWidth="17"
      strokeLinecap="round"
    />
    <circle cx="361" cy="377" r="13" fill="var(--color-fg-strong)" />
    <circle cx="535" cy="387" r="13" fill="var(--color-fg-strong)" />
    <path
      d="M447 219L428 189M495 198V158M548 218L570 188"
      stroke="var(--color-fg-strong)"
      strokeWidth="9"
      strokeLinecap="round"
    />
    <path
      fill="var(--ill-main)"
      d="M244 154C247 171 252 176 270 181C252 186 247 191 244 208C240 191 235 186 218 181C235 176 240 171 244 154Z"
    />
    <path
      fill="var(--ill-main)"
      d="M783 358C786 373 791 378 806 382C791 386 786 391 783 406C779 391 774 386 760 382C774 378 779 373 783 358Z"
    />
    <path
      fill="var(--ill-main)"
      d="M190 522C193 534 197 538 209 542C197 545 193 550 190 562C187 550 183 545 171 542C183 538 187 534 190 522Z"
    />
    <g fill="var(--ill-light)">
      <circle cx="782" cy="217" r="10" />
      <circle cx="194" cy="395" r="10" />
      <circle cx="796" cy="590" r="10" />
    </g>
  </svg>
)
