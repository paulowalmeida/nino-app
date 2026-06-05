'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import styles from './Header.module.css'

import { ENTRAR_URL } from '@/config'

const navLinks = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#para-restaurantes', label: 'Para restaurantes' },
  { href: '#precos', label: 'Preços' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <a href="#" className={styles.brand}>
            <Image
              src="/mascot.svg"
              alt=""
              width={40}
              height={40}
              className={styles.mascot}
              priority
            />
            <span className={styles.wordmark}>
              nino<i>.</i>
            </span>
          </a>

          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
            <a href={ENTRAR_URL} className={styles.enterButton}>
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
          </nav>

          <button
            className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <button
          className={styles.mobileClose}
          aria-label="Fechar menu"
          onClick={closeMenu}
        >
          ✕
        </button>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <a href={ENTRAR_URL} onClick={closeMenu}>
          Entrar
        </a>
      </div>
    </>
  )
}
