import { useNavigate } from 'react-router'

import { useIsDesktop } from '@pages/Storefront/hooks/useIsDesktop/useIsDesktop'
import { resolveBackHref } from '@utils/resolve-back-href'

import { ProductAddBar } from './components/ProductAddBar/ProductAddBar'
import { ProductChoices } from './components/ProductChoices/ProductChoices'
import { ProductDetailShell } from './components/ProductDetailShell/ProductDetailShell'
import { ProductHero } from './components/ProductHero/ProductHero'
import { ProductNotes } from './components/ProductNotes/ProductNotes'
import { ProductReplacementDialog } from './components/ProductReplacementDialog/ProductReplacementDialog'
import { ProductSummary } from './components/ProductSummary/ProductSummary'
import { ProductUnavailable } from './components/ProductUnavailable/ProductUnavailable'
import { useProductDetailFacade } from './facades/useProductDetailFacade/useProductDetailFacade'
import { ProductDetailSkeleton } from './skeletons/ProductDetailSkeleton/ProductDetailSkeleton'

export const ProductDetail = () => {
  const { product, slug, isProductPending, isProductError, isStorePending } =
    useProductDetailFacade()
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const closeToMenu = () => navigate(resolveBackHref(slug))

  const shellProps = {
    isDesktop,
    ariaLabel: product?.name ?? 'Produto',
    onClose: closeToMenu,
  }

  if (isStorePending || isProductPending) {
    return (
      <ProductDetailShell
        {...shellProps}
        media={null}
        details={<ProductDetailSkeleton />}
      />
    )
  }

  if (isProductError || !product) {
    return (
      <ProductDetailShell
        {...shellProps}
        media={null}
        details={<ProductUnavailable />}
      />
    )
  }

  return (
    <ProductDetailShell
      {...shellProps}
      media={<ProductHero />}
      stickyDetails={<ProductSummary compact />}
      details={
        <>
          <ProductSummary />
          <ProductChoices />
          <ProductNotes />
          <ProductReplacementDialog />
        </>
      }
      footer={<ProductAddBar />}
    />
  )
}
