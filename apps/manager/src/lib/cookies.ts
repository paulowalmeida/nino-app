export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

export function setCookie(name: string, value: string, maxAge: number): void {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function removeCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`
}
