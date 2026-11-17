import type { SVGProps } from 'react'

import styles from '@shared/components/Illustrations/Illustration.module.css'

export const StoreClosedIllustration = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="30 70 1330 1040"
    fill="none"
    aria-hidden="true"
    {...props}
    className={[styles.illustration, className].filter(Boolean).join(' ')}
  >
    <path
      fill="var(--ill-ghost)"
      d="M300 262C380 160 520 160 610 182C720 215 820 250 940 232C1060 214 1170 240 1230 340C1290 440 1240 520 1240 575C1245 645 1320 685 1340 785C1350 905 1230 1010 1000 1060C850 1092 720 1100 560 1090C380 1080 170 1000 80 840C20 740 50 600 150 500C215 455 260 420 300 262Z"
    />
    <ellipse cx="697" cy="955" rx="430" ry="40" fill="var(--ill-soft)" />
    <rect
      x="338"
      y="900"
      width="718"
      height="52"
      rx="26"
      fill="var(--ill-muted)"
    />
    <rect x="375" y="520" width="643" height="382" fill="var(--ill-light)" />
    <rect
      x="428"
      y="575"
      width="260"
      height="225"
      rx="20"
      fill="var(--ill-strong)"
    />
    <rect
      x="446"
      y="594"
      width="224"
      height="201"
      rx="10"
      fill="var(--ill-soft)"
    />
    <rect
      x="414"
      y="795"
      width="288"
      height="35"
      rx="17"
      fill="var(--ill-strong)"
    />
    <path
      d="M468 720L568 622M502 752L601 656"
      stroke="#fff"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path
      fill="var(--ill-strong)"
      d="M719 580Q719 559 740 559H942Q963 559 963 580V902H719Z"
    />
    <rect
      x="747"
      y="588"
      width="189"
      height="185"
      rx="14"
      fill="var(--ill-soft)"
    />
    <path
      d="M843 607L793 659M843 607L893 659"
      stroke="var(--color-fg-strong)"
      strokeWidth="3"
    />
    <rect
      x="763"
      y="658"
      width="162"
      height="83"
      rx="12"
      fill="var(--ill-main)"
    />
    <circle cx="843" cy="607" r="12" fill="var(--color-fg-strong)" />
    <circle cx="916" cy="806" r="16" fill="#fff" />
    <path
      fill="var(--ill-main)"
      d="M400 360H478L435 480A52.5 52.5 0 0 1 330 480Z"
    />
    <path fill="#fff" d="M478 360H563L541 480A53 53 0 0 1 435 480Z" />
    <path
      fill="var(--ill-main)"
      d="M563 360H655L648 480A53.5 53.5 0 0 1 541 480Z"
    />
    <path fill="#fff" d="M655 360H748L754 480A53 53 0 0 1 648 480Z" />
    <path
      fill="var(--ill-main)"
      d="M748 360H838L860 480A53 53 0 0 1 754 480Z"
    />
    <path fill="#fff" d="M838 360H924L966 480A53 53 0 0 1 860 480Z" />
    <path
      fill="var(--ill-main)"
      d="M924 360H1000L1072 480A53 53 0 0 1 966 480Z"
    />
    <rect
      x="395"
      y="318"
      width="603"
      height="44"
      rx="22"
      fill="var(--ill-strong)"
    />
    <path
      fill="var(--ill-main)"
      d="M697 101A83 83 0 1 0 770 218A72 72 0 0 1 697 101Z"
    />
    <g fill="var(--ill-main)">
      <path
        transform="translate(778 131) scale(0.75)"
        d="M0-36C3-14 14-3 36 0C14 3 3 14 0 36C-3 14-14 3-36 0C-14-3-3-14 0-36Z"
      />
      <path
        transform="translate(260 525) scale(0.85)"
        d="M0-36C3-14 14-3 36 0C14 3 3 14 0 36C-3 14-14 3-36 0C-14-3-3-14 0-36Z"
      />
      <path
        transform="translate(1143 432) scale(0.85)"
        d="M0-36C3-14 14-3 36 0C14 3 3 14 0 36C-3 14-14 3-36 0C-14-3-3-14 0-36Z"
      />
      <path
        transform="translate(1133 803) scale(0.85)"
        d="M0-36C3-14 14-3 36 0C14 3 3 14 0 36C-3 14-14 3-36 0C-14-3-3-14 0-36Z"
      />
    </g>
    <g fill="var(--ill-muted)">
      <circle cx="204" cy="649" r="11" />
      <circle cx="1103" cy="621" r="10" />
    </g>
    <path
      d="M1045 273L1022 316M1074 306L1042 334M300 755L337 787M282 797L325 809"
      stroke="var(--color-fg-strong)"
      strokeWidth="10"
      strokeLinecap="round"
    />
  </svg>
)
