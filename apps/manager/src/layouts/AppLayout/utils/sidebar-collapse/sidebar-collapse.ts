const KEY = 'nino.sidebar.collapsed'

export const readSidebarCollapsed = (): boolean => {
  try {
    return window.localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export const writeSidebarCollapsed = (collapsed: boolean): void => {
  try {
    window.localStorage.setItem(KEY, collapsed ? '1' : '0')
  } catch {
    /* CONSTRAINT: a preferência de layout não pode bloquear a aplicação. */
  }
}
