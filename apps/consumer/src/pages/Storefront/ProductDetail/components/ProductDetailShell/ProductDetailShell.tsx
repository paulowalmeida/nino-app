import { useLayoutEffect, type ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
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
 * Sempre uma Modal do DS. Mobile/tablet: ocupa a tela toda, sem X, só o
 * botão de voltar. Desktop: painel largo com a foto à esquerda, comportamento
 * default de abertura da Modal e sem botão de voltar — o X já fecha.
 */
export const ProductDetailShell = ({
  isDesktop,
  ariaLabel,
  onClose,
  media,
  details,
  footer,
}: ProductDetailShellProps) => {
  useLayoutEffect(() => {
    if (!isDesktop) window.scrollTo(0, 0)
  }, [isDesktop])

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  return (
    <Modal
      open
      onOpenChange={handleOpenChange}
      ariaLabel={ariaLabel}
      dismissible={isDesktop}
      positionerClassName={styles.positioner}
      contentClassName={styles.panel}
      body={
        <Box className={styles.grid}>
          <Box className={styles.media}>
            {!media && !isDesktop && (
              <Button
                variant="ghost"
                size="icon"
                className={styles.mobileBack}
                aria-label="Voltar ao cardápio"
                onClick={onClose}
              >
                <Icon name="arrow-left" />
              </Button>
            )}
            {media}
          </Box>
          <Box className={styles.details}>{details}</Box>
          {footer && <Box className={styles.footer}>{footer}</Box>}
        </Box>
      }
    />
  )
}
