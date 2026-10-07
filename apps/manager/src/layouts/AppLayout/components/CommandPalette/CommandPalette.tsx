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
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
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
      const navigationOptions = groups.flatMap(({ title, items }) =>
        items.map(({ section, label }) => ({
          value: section,
          label: title ? `${title} · ${label}` : label,
          inputLabel: label,
        }))
      )

      const allowedSections = new Set(
        groups.flatMap(({ items }) => items.map(({ section }) => section))
      )

      const functionalityOptions = FUNCTIONALITY_SEARCH_ITEMS.filter((item) =>
        allowedSections.has(item.section)
      ).map(({ section, label, group, target }) => ({
        value: `${target ?? section}::${label}`,
        label: `${group} · ${label}`,
        inputLabel: label,
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
    if (!open) return

    setQuery('')
    setActiveIndex(0)
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => setActiveIndex(0), [query])

  const navigateTo = (value: string) => {
    if (!unitId) return

    const section = value.split('::')[0]
    navigate(`/${unitId}/${section}`)
    onOpenChange(false)
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
      onOpenChange={onOpenChange}
      ariaLabel="Buscar funcionalidade"
      size="md"
      contentClassName={styles.modal}
      body={
        <Box className={styles.commandPaletteBody}>
          <Box className={styles.searchField}>
            <Icon name="search" size="sm" className={styles.searchIcon} />
            <Input
              ref={inputRef}
              placeholder="Buscar uma funcionalidade…"
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
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              className={styles.commandPaletteInput}
            />
          </Box>
          <Box
            id="command-palette-options"
            role="listbox"
            aria-label="Resultados da busca"
            className={styles.optionPanel}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <Button
                  key={option.value}
                  id={`command-palette-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  variant="ghost"
                  className={`${styles.option} ${
                    index === activeIndex ? styles.optionActive : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigateTo(option.value)}
                >
                  {option.label}
                </Button>
              ))
            ) : (
              <Text size="sm" color="faint" className={styles.emptyMessage}>
                Nenhuma funcionalidade encontrada
              </Text>
            )}
          </Box>
        </Box>
      }
      footer={
        <Text size="xs" color="faint">
          Ctrl/Cmd + K para abrir
        </Text>
      }
    />
  )
}
