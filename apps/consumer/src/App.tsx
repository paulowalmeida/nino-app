import { RouterProvider } from 'react-router'

import { ToastContainer } from '@nino/ds/components/Toast'
import { QueryProvider } from '@providers/QueryProvider/QueryProvider'
import { router } from '@router/routes'

export const App = () => (
  <QueryProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </QueryProvider>
)
