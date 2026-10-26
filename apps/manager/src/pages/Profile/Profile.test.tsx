import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useProfileFacade } from './facades/useProfileFacade/useProfileFacade'
import { Profile } from './Profile'
import { profilePageMock } from './Profile.mock'

vi.mock('./facades/useProfileFacade/useProfileFacade')
vi.mock('./components/ProfileHeader/ProfileHeader', () => ({
  ProfileHeader: () => <div>{profilePageMock.headerText}</div>,
}))
vi.mock('./components/ProfileForm/ProfileForm', () => ({
  ProfileForm: () => <div>{profilePageMock.formText}</div>,
}))
vi.mock('./skeletons/ProfileFieldsSkeleton/ProfileFieldsSkeleton', () => ({
  ProfileFieldsSkeleton: () => <div>{profilePageMock.loadingText}</div>,
}))

describe('Profile', () => {
  it('renders the loading macro state', () => {
    // Arrange
    vi.mocked(useProfileFacade).mockReturnValue({ status: 'loading' } as never)

    // Act
    render(<Profile />)

    // Assert
    expect(screen.getByText(profilePageMock.loadingText)).toBeInTheDocument()
  })

  it('renders the profile form after loading', () => {
    // Arrange
    vi.mocked(useProfileFacade).mockReturnValue({ status: 'success' } as never)

    // Act
    render(<Profile />)

    // Assert
    expect(screen.getByText(profilePageMock.headerText)).toBeInTheDocument()
    expect(screen.getByText(profilePageMock.formText)).toBeInTheDocument()
  })
})
