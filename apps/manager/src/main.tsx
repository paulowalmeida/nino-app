import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { dismissSplashWhenReady } from '@lib/dismiss-splash/dismiss-splash'
import {
  clearCompletedNavigation,
  rememberPendingNavigation,
} from '@router/pending-navigation'
import { router } from '@router/routes'

import { App } from './App.tsx'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

router.subscribe(({ location, navigation }) => {
  if (navigation.state === 'idle') {
    clearCompletedNavigation(location)
    return
  }

  rememberPendingNavigation(navigation.location)
})

dismissSplashWhenReady(
  () => router.state.initialized && router.state.navigation.state === 'idle'
)
