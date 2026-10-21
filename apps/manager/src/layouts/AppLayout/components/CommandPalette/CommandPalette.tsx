import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router'

import { useSidemenu } from '@layouts/AppLayout/hooks/useSidemenu/useSidemenu'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { FUNCTIONALITY_SEARCH_ITEMS } from './CommandPalette.constants'

import styles from './CommandPalette.module.css'

const commandShortcut = 'k'

const normalizeSearchText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate()
  const { groups } = useSidemenu()
  const unitId = useCurrentUnit()?.unitId
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const options = useMemo(
    () => {
      const iconBySection = new Map<string, IconName>(
        groups.flatMap(({ items }) =>
          items.map(({ section, icon }) => [section, icon] as const)
        )
      )

      const navigationOptions = groups.flatMap(({ title, items }) =>
        items.map(({ section, label, icon }) => ({
          value: section,
          label: title ? `${title} · ${label}` : label,
          inputLabel: label,
          path: title,
          icon,
        }))
      )

      const functionalityOptions = FUNCTIONALITY_SEARCH_ITEMS.filter((item) =>
        iconBySection.has(item.section)
      ).map(({ section, label, group, target }) => ({
        value: `${target ?? section}::${label}`,
        label: `${group} · ${label}`,
        inputLabel: label,
        path: group,
        icon: iconBySection.get(section),
      }))

      return [...navigationOptions, ...functionalityOptions]
    },
    [groups]
  )

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim())
    if (!normalizedQuery) return options

    return options.filter(({ label, inputLabel }) =>
      normalizeSearchText(`${label} ${inputLabel ?? ''}`).includes(
        normalizedQuery
      )
    )
  }, [options, query])

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === commandShortcut
      ) {
        event.preventDefault()
        onOpenChange(true)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onOpenChange])

  useEffect(() => {
    document
      .getElementById(`command-palette-option-${activeIndex}`)
      ?.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex])

  useEffect(() => {
    if (!open) return

    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  const changeOpen = (next: boolean) => {
    if (!next) {
      setQuery('')
      setActiveIndex(0)
    }
    onOpenChange(next)
  }

  const changeQuery = (value: string) => {
    setQuery(value)
    setActiveIndex(0)
  }

  const navigateTo = (value: string) => {
    if (!unitId) return

    const section = value.split('::')[0]
    navigate(`/${unitId}/${section}`)
    changeOpen(false)
  }

  const handleSearchKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) =>
        Math.min(current + 1, Math.max(filteredOptions.length - 1, 0))
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    }

    if (event.key === 'Enter' && filteredOptions[activeIndex]) {
      event.preventDefault()
      navigateTo(filteredOptions[activeIndex].value)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={changeOpen}
      ariaLabel="Buscar funcionalidade"
      size="md"
      contentClassName={styles.modal}
      bodyClassName={styles.commandPaletteBody}
      footerClassName={styles.commandPaletteFooter}
      body={
        <>
          <Box className={styles.searchField}>
            <Icon name="search" className={styles.searchIcon} />
            <Input
              ref={inputRef}
              placeholder="Para onde você quer ir?"
              type="search"
              aria-label="Buscar funcionalidade"
              aria-autocomplete="list"
              aria-controls="command-palette-options"
              aria-expanded
              aria-activedescendant={
                filteredOptions[activeIndex]
                  ? `command-palette-option-${activeIndex}`
                  : undefined
              }
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              className={styles.commandPaletteInput}
            />
          </Box>
          <ScrollArea className={styles.optionScroll} fadeEdges>
            <Box
              id="command-palette-options"
              role="listbox"
              aria-label="Resultados da busca"
              className={styles.optionPanel}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isActive = index === activeIndex

                  return (
                    <Button
                      key={option.value}
                      id={`command-palette-option-${index}`}
                      role="option"
                      aria-selected={isActive}
                      aria-label={option.label}
                      variant="ghost"
                      className={`${styles.option} ${
                        isActive ? styles.optionActive : ''
                      }`}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => navigateTo(option.value)}
                    >
                      <Box className={styles.optionIcon} aria-hidden="true">
                        <Icon name={option.icon ?? 'search'} size="sm" />
                      </Box>
                      <Box className={styles.optionText}>
                        <Text as="span" className={styles.optionTitle}>
                          {option.inputLabel}
                        </Text>
                        {option.path && (
                          <Text as="span" className={styles.optionPath}>
                            {option.path}
                          </Text>
                        )}
                      </Box>
                      {isActive && (
                        <kbd className={styles.optionEnter} aria-hidden="true">
                          ↵
                        </kbd>
                      )}
                    </Button>
                  )
                })
              ) : (
                <Box className={styles.empty}>
                  <Text as="p" className={styles.emptyTitle}>
                    Nada encontrado para “{query.trim()}”
                  </Text>
                  <Text as="p" className={styles.emptyHint}>
                    Tente o nome da tela, como Caixa ou Produtos.
                  </Text>
                </Box>
              )}
            </Box>
          </ScrollArea>
        </>
      }
      footer={
        <Box direction="row" gap={4} className={styles.hints} aria-hidden="true">
          <Text as="span" className={styles.hint}>
            <kbd className={styles.key}>↑</kbd>
            <kbd className={styles.key}>↓</kbd>
            navegar
          </Text>
          <Text as="span" className={styles.hint}>
            <kbd className={styles.key}>↵</kbd>
            abrir
          </Text>
          <Text as="span" className={styles.hint}>
            <kbd className={styles.key}>esc</kbd>
            fechar
          </Text>
        </Box>
      }
    />
  )
}
