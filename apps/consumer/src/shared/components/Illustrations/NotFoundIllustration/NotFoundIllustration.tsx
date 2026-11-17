import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const NotFoundIllustration = ({
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
      d="M160 374C174 309 238 285 277 227C318 166 381 139 447 157C505 173 547 146 610 165C678 185 689 240 743 273C803 309 846 352 837 415C828 477 870 511 831 568C793 624 713 625 652 651C588 678 532 650 467 661C394 673 337 665 291 624C247 584 188 586 162 533C136 478 146 436 160 374Z"
    />
    <ellipse cx="501" cy="641" rx="290" ry="33" fill="var(--ill-soft)" />
    <path
      fill="var(--ill-main)"
      d="M214 571C218 541 344 520 501 520C658 520 784 541 788 571L782 593C771 628 651 650 501 650C351 650 231 628 220 593Z"
    />
    <path
      fill="var(--ill-strong)"
      d="M501 614C631 614 747 595 788 571L782 593C771 628 651 650 501 650C455 650 411 648 372 643C494 648 650 625 699 608C638 619 568 622 501 622Z"
    />
    <ellipse cx="501" cy="565" rx="287" ry="62" fill="var(--ill-light)" />
    <ellipse cx="501" cy="559" rx="260" ry="48" fill="#fff" />
    <ellipse cx="501" cy="563" rx="211" ry="31" fill="var(--ill-ghost)" />
    <path
      fill="var(--ill-soft)"
      d="M291 563C291 545 385 532 501 532C617 532 711 545 711 563C683 549 599 541 501 541C403 541 319 549 291 563Z"
    />
    <path
      fill="#fff"
      d="M240 578C282 603 385 616 489 617C377 622 278 609 243 588Q230 581 240 578Z"
    />
    <g transform="translate(501 570) scale(1.2) translate(-501 -570)">
      <ellipse cx="503" cy="572" rx="160" ry="11" fill="var(--ill-soft)" />
      <path
        fill="var(--ill-strong)"
        fillRule="evenodd"
        transform="translate(308.1 350.1) scale(0.382)"
        d="M265 279Q269 272 278 272H325Q336 272 336 283V456H354Q365 456 365 467V504Q365 515 354 515H336V575Q336 586 325 586H285Q274 586 274 575V515H173Q162 515 162 504V469Q162 463 166 457ZM274 360L210 456H274Z"
      />
      <path
        fill="var(--ill-strong)"
        fillRule="evenodd"
        transform="translate(506.1 350.1) scale(0.382)"
        d="M265 279Q269 272 278 272H325Q336 272 336 283V456H354Q365 456 365 467V504Q365 515 354 515H336V575Q336 586 325 586H285Q274 586 274 575V515H173Q162 515 162 504V469Q162 463 166 457ZM274 360L210 456H274Z"
      />
      <path
        fill="var(--ill-strong)"
        fillRule="evenodd"
        transform="translate(7 4)"
        d="M501 450H501A42 42 0 0 1 543 492V528A42 42 0 0 1 501 570H501A42 42 0 0 1 459 528V492A42 42 0 0 1 501 450ZM501 478H501A16 16 0 0 1 517 494V526A16 16 0 0 1 501 542H501A16 16 0 0 1 485 526V494A16 16 0 0 1 501 478Z"
      />
      <path
        fill="var(--ill-main)"
        fillRule="evenodd"
        transform="translate(301.1 346.1) scale(0.382)"
        d="M265 279Q269 272 278 272H325Q336 272 336 283V456H354Q365 456 365 467V504Q365 515 354 515H336V575Q336 586 325 586H285Q274 586 274 575V515H173Q162 515 162 504V469Q162 463 166 457ZM274 360L210 456H274Z"
      />
      <path
        fill="var(--ill-main)"
        fillRule="evenodd"
        transform="translate(499.1 346.1) scale(0.382)"
        d="M265 279Q269 272 278 272H325Q336 272 336 283V456H354Q365 456 365 467V504Q365 515 354 515H336V575Q336 586 325 586H285Q274 586 274 575V515H173Q162 515 162 504V469Q162 463 166 457ZM274 360L210 456H274Z"
      />
      <path
        fill="var(--ill-main)"
        fillRule="evenodd"
        transform="translate(0 0)"
        d="M501 450H501A42 42 0 0 1 543 492V528A42 42 0 0 1 501 570H501A42 42 0 0 1 459 528V492A42 42 0 0 1 501 450ZM501 478H501A16 16 0 0 1 517 494V526A16 16 0 0 1 501 542H501A16 16 0 0 1 485 526V494A16 16 0 0 1 501 478Z"
      />
    </g>
    <g transform="translate(40 -92) rotate(-17 523 355)">
      <rect
        x="510"
        y="204"
        width="26"
        height="32"
        rx="10"
        fill="var(--ill-main)"
      />
      <path
        fill="var(--ill-strong)"
        d="M526 204H528Q536 204 536 214V226Q536 236 526 236Z"
      />
      <circle cx="523" cy="197" r="26" fill="var(--ill-muted)" />
      <path
        fill="var(--ill-main)"
        d="M536 175C548 181 553 196 546 209C539 223 521 228 508 218C525 221 540 204 540 191Q540 181 536 175Z"
      />
      <path
        fill="#fff"
        d="M504 192C505 181 517 174 526 179Q530 182 524 184C517 183 512 188 510 194Q506 199 504 192Z"
      />
      <path
        fill="var(--ill-muted)"
        d="M300 408C306 303 393 224 514 224C635 224 728 301 740 408Q630 437 519 437Q407 437 300 408Z"
      />
      <path
        fill="var(--ill-main)"
        d="M541 225C651 235 730 308 740 408Q680 426 616 432C635 375 618 322 592 283Q572 251 541 225Z"
      />
      <path
        fill="var(--ill-strong)"
        d="M679 308C715 335 735 370 740 408Q709 418 679 422C692 380 691 343 679 308Z"
      />
      <path
        fill="var(--ill-light)"
        d="M319 389C333 307 408 248 496 242C420 258 363 309 346 390Q333 396 319 389Z"
      />
      <ellipse cx="520" cy="415" rx="235" ry="27" fill="var(--ill-strong)" />
      <path
        fill="var(--ill-main)"
        d="M285 402C285 420 390 433 520 433C650 433 755 420 755 402V416C755 436 650 450 520 450C390 450 285 436 285 416Z"
      />
      <ellipse cx="520" cy="402" rx="235" ry="25" fill="var(--ill-light)" />
      <ellipse cx="520" cy="399" rx="214" ry="15" fill="var(--ill-muted)" />
      <path
        fill="var(--ill-ghost)"
        d="M305 401C342 414 430 422 520 422C421 427 334 420 307 410Q299 405 305 401Z"
      />
    </g>
    <g fill="var(--ill-main)">
      <path d="M267 224Q272 246 294 251Q272 256 267 278Q262 256 240 251Q262 246 267 224Z" />
      <path d="M753 437Q756 450 769 453Q756 456 753 469Q750 456 737 453Q750 450 753 437Z" />
    </g>
    <g fill="var(--ill-light)">
      <circle cx="206" cy="432" r="7" />
      <circle cx="884" cy="318" r="8" />
      <circle cx="787" cy="536" r="5" />
    </g>
    <g stroke="var(--color-fg-strong)" strokeWidth="8" strokeLinecap="round">
      <path d="M846 196L866 178" />
      <path d="M858 226L884 220" />
    </g>
  </svg>
)
