import type { IconProps } from './icon-props'

export function IconClipboard({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6
           a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
      />
      <path
        d="M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9
           a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
      />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
}
