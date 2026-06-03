export type CreateUserRequest = {
  name: string
  phone?: string
  globalRoleId: string
  isActive?: boolean
  locale?: string
  timezone?: string
}
