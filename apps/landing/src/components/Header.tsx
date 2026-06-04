'use client'

import { useState } from 'react'
import Image from 'next/image'

import { CADASTRO_URL } from '@/config'

const navLinks = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#para-restaurantes', label: 'Para restaurantes' },
  { href: '#precos', label: 'Preços' },
]

const gestorUrl = 'https://gestor-dev.nino.delivery'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <nav>
        <div className="logo">
          <Image
            src="/logo.svg"
            alt="Nino Delivery"
            width={185}
            height={60}
            priority
          />
        </div>

        <div className="nav-links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href={gestorUrl} className="btn-login">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Entrar
          </a>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobile-menu">
        <button className="close-menu" onClick={closeMenu}>
          ✕
        </button>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <a href={gestorUrl} className="mobile-login">
          Entrar no gestor →
        </a>
        <a href={CADASTRO_URL} className="mobile-cta" onClick={closeMenu}>
          Criar minha loja
        </a>
      </div>
    </>
  )
}
