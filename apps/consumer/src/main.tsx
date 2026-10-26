import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { resolveLocalStoreRedirect } from '@utils/local-store-redirect'

import { App } from './App.tsx'
import './index.css'

const localStoreRedirect = resolveLocalStoreRedirect(window.location.href)

if (localStoreRedirect) {
  window.location.replace(localStoreRedirect)
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
