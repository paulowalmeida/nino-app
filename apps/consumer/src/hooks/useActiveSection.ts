import { useEffect, useState } from 'react'

/**
 * Qual seção está sob os olhos agora: acompanha o scroll para acender a
 * categoria certa na trilha. A margem de topo desconta a própria trilha
 * fixa, senão a seção "ativa" troca cedo demais.
 */
export const useActiveSection = (ids: string[]): string | null => {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [ids])

  return active
}
