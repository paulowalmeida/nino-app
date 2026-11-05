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
import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { cartItemPrice } from '@utils/cart-item-price/cart-item-price'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { CartPromotionProgress } from '@pages/Storefront/components/StoreCart/CartDrawer/CartPromotionProgress/CartPromotionProgress'

import styles from './CartDrawer.module.css'
import motionStyles from '@styles/motion.module.css'

export const CartDrawer = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const home = useStorefrontFacade()
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
  const { isDesktop } = home
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)

  /*
   * WHY: esvaziar fecha. Ver a sacola se esvaziar na frente e virar tela vazia
   * é um beco — o empty state existe para quem abre a sacola já vazia, não
   * como destino de quem acabou de remover o último item.
   */
  const handleConfirmClear = () => {
    setIsConfirmingClear(false)
    onClear()
    onOpenChange(false)
  }

  const handleDecrement = (itemId: string, isLastOfCart: boolean) => {
    onDecrement(itemId)
    if (isLastOfCart) onOpenChange(false)
  }

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        placement={isDesktop ? 'right' : 'bottom'}
        dismissible={isDesktop}
        title={
          <Box className={styles.head}>
            <Text as="span" className={styles.headTitle}>
              Sua sacola
            </Text>
            {lines.length > 0 && (
              <Text as="span" className={styles.headCount}>
                {itemCount} {itemCount === 1 ? 'item' : 'itens'}
              </Text>
            )}
          </Box>
        }
        size={isDesktop ? '25rem' : 'var(--cart-drawer-height)'}
        contentClassName={isDesktop ? styles.cartDrawerPanel : styles.sheet}
        bodyClassName={styles.cartDrawerViewport}
      >
        <Box className={styles.cartDrawerBody}>
          {lines.length === 0 ? (
            <EmptyState
              size="md"
              className={`${motionStyles.riseIn} ${styles.cartDrawerEmpty}`}
              illustration={<img src="/mascot-consumer.svg" alt="" />}
              title="Sua sacola está vazia"
              action={
                <Button
                  className={styles.emptyAction}
                  onClick={() => onOpenChange(false)}
                >
                  Ver cardápio
                </Button>
              }
            >
              Escolha um item do cardápio para começar.
            </EmptyState>
          ) : (
            <>
              <Box className={styles.lines}>
                <AnimatePresence initial={false}>
                  {lines.map(({ id, item, quantity }, index) => {
                    const isLastUnit = quantity === 1

                    return (
                      <motion.div
                        key={id}
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
                          {item.modifiers && item.modifiers.length > 0 && (
                            <Text as="span" className={styles.lineChoices}>
                              {item.modifiers
                                .map((modifier) => modifier.name)
                                .join(', ')}
                            </Text>
                          )}
                          {item.notes && (
                            <Text as="span" className={styles.lineChoices}>
                              {item.notes}
                            </Text>
                          )}
                          <Text as="span" className={styles.lineMath}>
                            {item.package
                              ? 'Preço fechado da promoção'
                              : `${brl(cartItemPrice(item))} cada`}
                          </Text>

                          {item.package ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className={styles.stepper}
                              onClick={() =>
                                handleDecrement(id, lines.length === 1)
                              }
                            >
                              Remover
                            </Button>
                          ) : (
                            <QuantityStepper
                              size="sm"
                              className={styles.stepper}
                              quantity={quantity}
                              count={<AnimatedNumber value={quantity} />}
                              decrementIcon={isLastUnit ? 'trash' : 'minus'}
                              decrementLabel={
                                isLastUnit
                                  ? `Remover ${item.name} da sacola`
                                  : `Remover uma unidade de ${item.name}`
                              }
                              incrementLabel={`Adicionar mais uma unidade de ${item.name}`}
                              onDecrement={() =>
                                handleDecrement(
                                  id,
                                  isLastUnit && lines.length === 1
                                )
                              }
                              onIncrement={() => onIncrement(id)}
                            />
                          )}
                        </Box>

                        <AnimatedNumber
                          value={brl(cartItemPrice(item) * quantity)}
                          className={styles.lineTotal}
                        />
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </Box>

              <Box className={styles.cartDrawerFooter}>
                <CartPromotionProgress />
                <Box direction="row" className={styles.totalRow}>
                  <Box>
                    <Text className={styles.totalLabel}>Total</Text>
                    {estimatedMinutes ? (
                      <Text className={styles.totalEta}>
                        pronto em ~{estimatedMinutes} min
                      </Text>
                    ) : null}
                  </Box>
                  <AnimatedNumber
                    value={brl(total)}
                    className={styles.cartDrawerTotal}
                  />
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
