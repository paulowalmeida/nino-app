import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FileUpload } from './FileUpload'

describe(FileUpload.displayName!, () => {
  it('renders the dropzone', () => {
    render(<FileUpload />)
    expect(screen.getByText('Click to upload')).toBeInTheDocument()
  })

  it('renders the drag and drop hint', () => {
    render(<FileUpload />)
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument()
  })

  it('shows max file size when provided', () => {
    render(<FileUpload maxFileSize={1024 * 1024} />)
    expect(screen.getByText('Max 1.0 MB')).toBeInTheDocument()
  })

  it('shows max files hint when maxFiles > 1', () => {
    render(<FileUpload maxFiles={5} />)
    expect(screen.getByText('Up to 5 files')).toBeInTheDocument()
  })

  it('renders the hidden input', () => {
    render(<FileUpload name="avatar" />)
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument()
  })
})
