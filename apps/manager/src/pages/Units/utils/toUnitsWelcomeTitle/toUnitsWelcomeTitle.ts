export const toUnitsWelcomeTitle = (name?: string | null) => {
  const firstName = name?.trim().split(/\s+/)[0]
  return firstName ? `Sua primeira loja, ${firstName}` : 'Sua primeira loja'
}
