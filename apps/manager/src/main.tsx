import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { dismissSplashWhenReady } from '@lib/dismiss-splash'
import { router } from '@router/routes'

import { App } from './App.tsx'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

dismissSplashWhenReady(
  () => router.state.initialized && router.state.navigation.state === 'idle'
)
