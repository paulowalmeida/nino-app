import { ToastContainer } from '@nino/ds'
import { RouterProvider } from 'react-router'

import { QueryProvider } from '@providers/QueryProvider'
import { router } from '@router/routes'

export const App = () => (
  <QueryProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </QueryProvider>
)
