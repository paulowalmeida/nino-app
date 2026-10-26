import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FileUpload } from './FileUpload'

describe(FileUpload.name, () => {
  it('renders the dropzone', () => {
    render(<FileUpload />)
    expect(screen.getByText('Escolher arquivo')).toBeInTheDocument()
  })

  it('renders the drag and drop hint', () => {
    render(<FileUpload />)
    expect(screen.getByText(/arraste até aqui/i)).toBeInTheDocument()
  })

  it('shows max file size when provided', () => {
    render(<FileUpload maxFileSize={1024 * 1024} />)
    expect(screen.getByText('Até 1.0 MB por arquivo')).toBeInTheDocument()
  })

  it('shows max files hint when maxFiles > 1', () => {
    render(<FileUpload maxFiles={5} />)
    expect(screen.getByText('No máximo 5 arquivos')).toBeInTheDocument()
  })

  it('renders the hidden input', () => {
    render(<FileUpload name="avatar" />)
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument()
  })
})
