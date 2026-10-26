export type AccountAddressesState = {
  editingId: string | null
  confirmingDeleteId: string | null
  startEditing: (id: string) => void
  cancelEditing: () => void
  requestDelete: (id: string) => void
  cancelDelete: () => void
}
