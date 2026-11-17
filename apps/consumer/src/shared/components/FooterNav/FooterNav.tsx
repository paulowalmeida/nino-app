import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { TabBar } from '@shared/components/TabBar/TabBar/TabBar'

type FooterNavProps = {
  base: string
  cartCount?: number
  onOpenCart?: () => void
  onOpenSearch?: () => void
}

export const FooterNav = ({
  base,
  cartCount,
  onOpenCart,
  onOpenSearch,
}: FooterNavProps) => (
  <>
    <PoweredBy />
    <TabBar
      base={base}
      cartCount={cartCount}
      onOpenCart={onOpenCart}
      onOpenSearch={onOpenSearch}
    />
  </>
)
