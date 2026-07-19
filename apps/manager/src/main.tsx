import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { router } from '@router/routes'
import { dismissSplashWhenReady } from '@utils/dismiss-splash'

import './index.css'
import { App } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

dismissSplashWhenReady(
  () => router.state.initialized && router.state.navigation.state === 'idle'
)
