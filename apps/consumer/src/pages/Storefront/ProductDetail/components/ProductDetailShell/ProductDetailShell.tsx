import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Drawer } from '@nino/ds/components/Drawer'
import { Modal } from '@nino/ds/components/Modal'

import styles from './ProductDetailShell.module.css'

type ProductDetailShellProps = {
  isDesktop: boolean
  ariaLabel: string
  onClose: () => void
  media: ReactNode
  details: ReactNode
  footer?: ReactNode
}

/**
 * Mobile: tela cheia, tudo empilhado. Desktop: modal larga com a foto à
 * esquerda, só a coluna de escolhas rola, e o rodapé fica fora da rolagem.
 */
export const ProductDetailShell = ({
  isDesktop,
  ariaLabel,
  onClose,
  media,
  details,
  footer,
}: ProductDetailShellProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  if (!isDesktop) {
    return (
      <Drawer
        open
        onOpenChange={handleOpenChange}
        placement="bottom"
        size="100dvh"
        bodyClassName={styles.sheetBody}
      >
        {media}
        {details}
        {footer}
      </Drawer>
    )
  }

  return (
    <Modal
      open
      onOpenChange={handleOpenChange}
      ariaLabel={ariaLabel}
      backdropClassName={styles.backdrop}
      contentClassName={styles.panel}
      body={
        <Box className={styles.grid}>
          <Box className={styles.media}>{media}</Box>
          <Box className={styles.details}>{details}</Box>
          {footer && <Box className={styles.footer}>{footer}</Box>}
        </Box>
      }
    />
  )
}
