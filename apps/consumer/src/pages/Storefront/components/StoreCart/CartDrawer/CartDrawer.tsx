import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { Dialog } from '@nino/ds/components/Dialog'
import { Drawer } from '@nino/ds/components/Drawer'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Image } from '@nino/ds/components/Image'
import { QuantityStepper } from '@nino/ds/components/QuantityStepper'
import { AnimatedNumber } from '@shared/components/AnimatedNumber/AnimatedNumber'
import { EXPO_OUT_EASE } from '@constants/motion.constants'
import { useIsDesktop } from '@pages/Storefront/hooks/useIsDesktop/useIsDesktop'
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { useStorefrontSlug } from '@pages/Storefront/hooks/useStorefrontSlug/useStorefrontSlug'

import styles from './CartDrawer.module.css'
import motionStyles from '@styles/motion.module.css'

export const CartDrawer = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const home = useStorefrontFacade(useStorefrontSlug())
  const {
    isCartOpen: open,
    setCartOpen: onOpenChange,
    cartLines: lines,
    cartTotal: total,
    estimatedMinutes,
    incrementCartLine: onIncrement,
    decrementCartLine: onDecrement,
    clearCart: onClear,
  } = home
  const onCheckout = () => {
    onOpenChange(false)
    void navigate(slug ? `/${slug}/checkout` : '/checkout')
  }
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const isDesktop = useIsDesktop()
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)

  const handleConfirmClear = () => {
    setIsConfirmingClear(false)
    onClear()
  }

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        placement={isDesktop ? 'right' : 'bottom'}
        title="Sua sacola"
        description={
          lines.length === 0
            ? undefined
            : `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`
        }
        size={isDesktop ? '25rem' : 'auto'}
        contentClassName={isDesktop ? styles.panel : styles.sheet}
      >
        <Box className={styles.body}>
          {lines.length === 0 ? (
            <EmptyState
              size="md"
              className={`${motionStyles.riseIn} ${styles.empty}`}
              illustration={<img src="/mascot-consumer.svg" alt="" />}
              title="Sua sacola está vazia"
            >
              Volte ao cardápio e escolha o que vai pedir.
            </EmptyState>
          ) : (
            <>
              <Box className={styles.lines}>
                <AnimatePresence initial={false}>
                  {lines.map(({ item, quantity }, index) => {
                    const isLastUnit = quantity === 1

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -24,
                          height: 0,
                          marginBottom: 0,
                        }}
                        transition={{
                          duration: 0.28,
                          ease: EXPO_OUT_EASE,
                          delay: index * 0.04,
                        }}
                        className={styles.line}
                      >
                        <Image
                          src={item.imageUrl}
                          alt=""
                          className={styles.photo}
                          wrapperClassName={styles.photoWrap}
                          placeholder={
                            <Box
                              className={styles.photoFallback}
                              aria-hidden="true"
                            >
                              {categoryIcon(item.name) ?? '🍽️'}
                            </Box>
                          }
                        />

                        <Box className={styles.lineText}>
                          <Text as="span" className={styles.lineName}>
                            {item.name}
                          </Text>
                          <Text as="span" className={styles.lineMath}>
                            {quantity} × {brl(item.price)}
                          </Text>
                        </Box>

                        <Box className={styles.lineRight}>
                          <AnimatedNumber
                            value={brl(Number(item.price) * quantity)}
                            className={styles.lineTotal}
                          />

                          <QuantityStepper
                            size="sm"
                            quantity={quantity}
                            count={<AnimatedNumber value={quantity} />}
                            decrementIcon={isLastUnit ? 'trash' : 'minus'}
                            decrementLabel={
                              isLastUnit
                                ? `Remover ${item.name} da sacola`
                                : `Remover uma unidade de ${item.name}`
                            }
                            incrementLabel={`Adicionar mais uma unidade de ${item.name}`}
                            onDecrement={() => onDecrement(item.id)}
                            onIncrement={() => onIncrement(item.id)}
                          />
                        </Box>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </Box>

              <Box className={styles.footer}>
                <Box className={styles.totalRow}>
                  <Box>
                    <Text className={styles.totalLabel}>Total</Text>
                    {estimatedMinutes ? (
                      <Text className={styles.totalEta}>
                        pronto em ~{estimatedMinutes} min
                      </Text>
                    ) : null}
                  </Box>
                  <AnimatedNumber value={brl(total)} className={styles.total} />
                </Box>
                <Button className={styles.checkout} onClick={onCheckout}>
                  Finalizar pedido
                </Button>
                <Button
                  variant="ghost"
                  className={styles.clear}
                  onClick={() => setIsConfirmingClear(true)}
                >
                  Esvaziar sacola
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <Dialog
        open={isConfirmingClear}
        onOpenChange={(isOpen) => !isOpen && setIsConfirmingClear(false)}
        title="Esvaziar a sacola?"
        description="Todos os itens serão removidos. Não dá para desfazer."
        confirmLabel="Esvaziar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmClear}
        onCancel={() => setIsConfirmingClear(false)}
      />
    </>
  )
}
