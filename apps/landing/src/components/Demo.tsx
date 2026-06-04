'use client'

import { useState } from 'react'

import { demoMockups } from './demo-content'

const tabs = [
  { id: 'pedido', label: '🛒 Fazer pedido' },
  { id: 'acompanhar', label: '📍 Acompanhar' },
  { id: 'dashboard', label: '📊 Dashboard' },
] as const

type TabId = (typeof tabs)[number]['id']

export function Demo() {
  const [active, setActive] = useState<TabId>('pedido')

  return (
    <section id="demo" className="demo">
      <div className="demo-inner">
        <div className="demo-header">
          <h2>Como fica o seu delivery</h2>
          <p>Tudo que seu cliente vê — na palma da mão, com a sua marca.</p>
        </div>

        <div className="demo-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`demo-tab${active === tab.id ? ' active' : ''}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="demo-mockup"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: demoMockups[active] }}
        />
      </div>
    </section>
  )
}
