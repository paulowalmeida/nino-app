import { useState } from 'react'
import type { KeyboardEvent } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'
import type { CouponCodeForm } from '@custom_types/promotion/coupon-code-form.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import type { CouponBlocker } from '@utils/coupon-blocker/coupon-blocker'

import { CouponCard } from '@shared/components/CouponCard/CouponCard'

import styles from './CouponsList.module.css'

type CouponsListProps = {
  coupons: PublicPromotion[]
  blockerOf: (promotion: PublicPromotion) => CouponBlocker | null
  appliedId?: string
  codeForm?: CouponCodeForm
  /** Aba que abre primeiro; a vitrine abre a de quem não vale ainda. */
  defaultTab: 'available' | 'unavailable'
  emptyAvailable: string
  emptyUnavailable: string
  onOpen: (id: string) => void
}

export const CouponsList = ({
  coupons,
  blockerOf,
  appliedId,
  codeForm,
  defaultTab,
  emptyAvailable,
  emptyUnavailable,
  onOpen,
}: CouponsListProps) => {
  const [code, setCode] = useState('')
  const available = coupons.filter((item) => !blockerOf(item))
  const unavailable = coupons.filter((item) => blockerOf(item))

  const submitCode = () => {
    if (code.trim()) codeForm?.onSubmit(code)
  }

  /* WHY: o painel pode viver dentro do formulário do pedido; Enter aqui
   * aplica o cupom em vez de confirmar o pedido. */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    submitCode()
  }

  const list = (items: PublicPromotion[], emptyText: string) => (
    <Box as="ul" className={styles.couponList}>
      {items.length === 0 && (
        <Text className={styles.emptyText}>{emptyText}</Text>
      )}
      {items.map((promotion) => (
        <li key={promotion.id}>
          <button
            type="button"
            data-coupon-id={promotion.id}
            className={styles.couponButton}
            onClick={() => onOpen(promotion.id)}
          >
            <CouponCard promotion={promotion} blocker={blockerOf(promotion)}>
              {appliedId === promotion.id ? (
                <Text as="span" className={styles.appliedTag}>
                  Aplicado
                </Text>
              ) : (
                <Icon
                  name="chevron-right"
                  size="sm"
                  className={styles.chevron}
                />
              )}
            </CouponCard>
          </button>
        </li>
      ))}
    </Box>
  )

  return (
    <Box className={styles.couponsList}>
      {codeForm && (
        <>
          <Box direction="row" className={styles.codeForm}>
            <Input
              value={code}
              placeholder="Código do cupom"
              aria-label="Código do cupom"
              autoCapitalize="characters"
              error={!!codeForm.error}
              onKeyDown={handleKeyDown}
              onChange={(event) =>
                setCode(event.target.value.toUpperCase().replace(/\s/g, ''))
              }
            />
            <Button
              type="button"
              variant="secondary"
              loading={codeForm.isLoading}
              onClick={submitCode}
            >
              Aplicar
            </Button>
          </Box>
          {codeForm.error && (
            <Text role="alert" className={styles.codeError}>
              {codeForm.error}
            </Text>
          )}
        </>
      )}
      <Tabs
        fullWidth
        label="Cupons da loja"
        defaultValue={defaultTab}
        tabs={[
          {
            value: 'available',
            label: `Disponíveis (${available.length})`,
            content: list(available, emptyAvailable),
          },
          {
            value: 'unavailable',
            label: `Indisponíveis (${unavailable.length})`,
            content: list(unavailable, emptyUnavailable),
          },
        ]}
      />
    </Box>
  )
}
