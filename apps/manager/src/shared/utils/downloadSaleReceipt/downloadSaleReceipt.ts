export const downloadSaleReceipt = (receipt: Blob, filename: string): void => {
  const url = URL.createObjectURL(receipt)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename

  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  URL.revokeObjectURL(url)
}
