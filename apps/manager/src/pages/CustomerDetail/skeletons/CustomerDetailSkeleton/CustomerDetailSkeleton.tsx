import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { CustomerContactSkeleton } from '@pages/CustomerDetail/skeletons/CustomerDetailSkeleton/CustomerContactSkeleton/CustomerContactSkeleton'
import { CustomerHeaderSkeleton } from '@pages/CustomerDetail/skeletons/CustomerDetailSkeleton/CustomerHeaderSkeleton/CustomerHeaderSkeleton'
import { CustomerSummarySkeleton } from '@pages/CustomerDetail/skeletons/CustomerDetailSkeleton/CustomerSummarySkeleton/CustomerSummarySkeleton'
import { CustomerWorkspaceSkeleton } from '@pages/CustomerDetail/skeletons/CustomerDetailSkeleton/CustomerWorkspaceSkeleton/CustomerWorkspaceSkeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import page from '@pages/CustomerDetail/CustomerDetail.module.css'

/* WHY: o Breadcrumb não vira osso — já navega sem o cliente carregado e
 * sumiria da tela se virasse barra cinza. */
export const CustomerDetailSkeleton = () => (
  <Box className={page.page}>
    <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />

    <Text as="p" role="status" className="sr-only">
      Carregando o cliente
    </Text>

    <CustomerHeaderSkeleton />
    <CustomerSummarySkeleton />
    <CustomerContactSkeleton />
    <CustomerWorkspaceSkeleton />
  </Box>
)
