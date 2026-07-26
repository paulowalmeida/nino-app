export type EditEmailFormValues = {
  email: string
}

export type EditEmailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  hint: string
  currentEmail: string | null
  onSave: (email: string) => Promise<void>
}
