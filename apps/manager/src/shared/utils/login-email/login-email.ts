export const loginEmailOf = (user: {
  credentials?: { email: string | null }[]
}): string | null =>
  user.credentials?.find(({ email }) => !!email)?.email ?? null
