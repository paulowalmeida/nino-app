import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { DrawerPlacement, DrawerProps } from './Drawer.types'

const backdropClass =
  'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200'

const positionerClass = 'fixed inset-0 z-50 flex overflow-hidden'

const alignByPlacement: Record<DrawerPlacement, string> = {
  right: 'ml-auto',
  left: 'mr-auto',
  bottom: 'mt-auto',
  top: 'mb-auto',
}

const sizeByPlacement: Record<DrawerPlacement, string> = {
  right: 'h-full',
  left: 'h-full',
  bottom: 'w-full',
  top: 'w-full',
}

const animationByPlacement: Record<DrawerPlacement, string> = {
  right:
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
  left: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
  bottom:
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  top: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
}

const baseContent = 'flex flex-col bg-white shadow-xl outline-none duration-300'

const baseHeader =
  'flex items-center justify-between border-b border-gray-200 px-6 py-4'

const titleClass = 'text-base font-semibold text-gray-900'
const descriptionClass = 'mt-1 text-sm text-gray-500'
const baseBody = 'flex-1 overflow-y-auto px-6 py-4'

const closeButtonClass =
  'rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export function Drawer({
  open,
  onOpenChange,
  placement = 'right',
  title,
  description,
  children,
  size,
  contentClassName,
}: DrawerProps) {
  const isHorizontal = placement === 'left' || placement === 'right'
  const sizeStyle = size
    ? isHorizontal
      ? { width: size }
      : { height: size }
    : isHorizontal
      ? { width: '400px' }
      : { height: '320px' }

  return (
    <ArkDialog.Root
      open={open}
      onOpenChange={({ open: o }) => onOpenChange(o)}
      lazyMount
      unmountOnExit
    >
      <Portal>
        <ArkDialog.Backdrop className={backdropClass} />
        <ArkDialog.Positioner className={positionerClass}>
          <ArkDialog.Content
            className={mergeClasses(
              baseContent,
              sizeByPlacement[placement],
              alignByPlacement[placement],
              animationByPlacement[placement],
              contentClassName ?? ''
            )}
            style={sizeStyle}
          >
            {(title || description) && (
              <div className={baseHeader}>
                <div>
                  {title && (
                    <ArkDialog.Title className={titleClass}>
                      {title}
                    </ArkDialog.Title>
                  )}
                  {description && (
                    <ArkDialog.Description className={descriptionClass}>
                      {description}
                    </ArkDialog.Description>
                  )}
                </div>
                <ArkDialog.CloseTrigger
                  className={closeButtonClass}
                  aria-label="Close"
                >
                  <CloseIcon />
                </ArkDialog.CloseTrigger>
              </div>
            )}
            <div className={baseBody}>{children}</div>
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}

Drawer.displayName = 'Drawer'
