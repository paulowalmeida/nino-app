import { useEffect, useRef } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Drawer } from '@nino/ds/components/Drawer'
import type { PublicDeliveryZone } from '@custom_types/delivery-zone/PublicDeliveryZone.type'
import type { CouponCodeForm } from '@custom_types/promotion/coupon-code-form.type'
import type { CouponDetailAction } from '@custom_types/promotion/coupon-detail-action.type'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import type { CouponBlocker } from '@utils/coupon-blocker/coupon-blocker'
import { useCouponsPages } from '@hooks/useCouponsPages/useCouponsPages'

import { CouponDetail } from './CouponDetail/CouponDetail'
import { CouponsList } from './CouponsList/CouponsList'

import { StoreTintScope } from '@shared/components/StoreTintScope/StoreTintScope'
import styles from './CouponsDrawer.module.css'

type CouponsDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupons: PublicPromotion[]
  blockerOf: (promotion: PublicPromotion) => CouponBlocker | null
  zones: PublicDeliveryZone[]
  /** Cupom cuja página abre primeiro; sem ele, abre na lista. */
  initialDetailId?: string | null
  appliedId?: string
  codeForm?: CouponCodeForm
  action: CouponDetailAction
  emptyAvailable: string
  emptyUnavailable: string
}

/* WHY: duas páginas num painel só — a lista e o detalhe lado a lado numa
 * esteira que desliza. A página escondida fica `inert`: sem foco, sem leitor
 * de tela, e a lista mantém o scroll de onde o cliente saiu. */
export const CouponsDrawer = ({
  open,
  onOpenChange,
  coupons,
  blockerOf,
  zones,
  initialDetailId,
  appliedId,
  codeForm,
  action,
  emptyAvailable,
  emptyUnavailable,
}: CouponsDrawerProps) => {
  const pages = useCouponsPages(open, initialDetailId)
  const viewportRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const wasDetailRef = useRef(pages.isDetail)

  const shown = coupons.find(({ id }) => id === pages.shownId)
  const defaultTab =
    shown && blockerOf(shown)
      ? ('unavailable' as const)
      : ('available' as const)

  /* WHY: ao entrar no detalhe o foco vai ao voltar; ao sair, retorna ao cupom
   * de onde o cliente veio — ninguém perde o lugar na lista. Sem
   * preventScroll, o navegador rolava os contêineres do painel para mostrar a
   * página que ainda estava fora da esteira, e a gaveta inteira saltava. */
  useEffect(() => {
    if (pages.isDetail === wasDetailRef.current) return
    wasDetailRef.current = pages.isDetail
    if (pages.isDetail) {
      backRef.current?.focus({ preventScroll: true })
      return
    }
    viewportRef.current
      ?.querySelector<HTMLElement>(`[data-coupon-id="${pages.shownId}"]`)
      ?.focus({ preventScroll: true })
  }, [pages.isDetail, pages.shownId])

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      placement="right"
      size="26rem"
      fullOnMobile
      title={pages.isDetail ? 'Detalhes do cupom' : 'Cupons'}
      bodyClassName={styles.viewportBody}
      onEscapeKeyDown={(event) => {
        if (!pages.isDetail) return
        event.preventDefault()
        pages.back()
      }}
    >
      <StoreTintScope>
        <div ref={viewportRef} className={styles.viewport}>
          <Box
            direction="row"
            className={pages.isDetail ? styles.trackDetail : styles.trackList}
          >
            <Box
              className={styles.page}
              inert={pages.isDetail}
              aria-hidden={pages.isDetail}
            >
              <CouponsList
                coupons={coupons}
                blockerOf={blockerOf}
                appliedId={appliedId}
                codeForm={codeForm}
                defaultTab={defaultTab}
                emptyAvailable={emptyAvailable}
                emptyUnavailable={emptyUnavailable}
                onOpen={pages.openDetail}
              />
            </Box>
            <Box
              className={styles.page}
              inert={!pages.isDetail}
              aria-hidden={!pages.isDetail}
            >
              {shown && (
                <CouponDetail
                  promotion={shown}
                  blocker={blockerOf(shown)}
                  zones={zones}
                  isApplied={appliedId === shown.id}
                  action={action}
                  backRef={backRef}
                  onBack={pages.back}
                />
              )}
            </Box>
          </Box>
        </div>
      </StoreTintScope>
    </Drawer>
  )
}
