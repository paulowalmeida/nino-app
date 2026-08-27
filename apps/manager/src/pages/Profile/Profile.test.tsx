import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useProfileFacade } from './facades/useProfileFacade/useProfileFacade'
import { Profile } from './Profile'
import { profilePageMock } from './Profile.mock'

vi.mock('./facades/useProfileFacade/useProfileFacade')
vi.mock('./components/ProfileHeader/ProfileHeader', () => ({
  ProfileHeader: () => <div>profile header</div>,
}))
vi.mock('./components/ProfileForm/ProfileForm', () => ({
  ProfileForm: () => <div>profile form</div>,
}))
vi.mock('./skeletons/ProfileFieldsSkeleton/ProfileFieldsSkeleton', () => ({
  ProfileFieldsSkeleton: () => <div>profile loading</div>,
}))

describe('Profile', () => {
  it('renders the loading macro state', () => {
    vi.mocked(useProfileFacade).mockReturnValue({ status: 'loading' } as never)

    render(<Profile />)

    expect(screen.getByText('profile loading')).toBeInTheDocument()
  })

  it('renders the profile form after loading', () => {
    vi.mocked(useProfileFacade).mockReturnValue({ status: 'success' } as never)

    render(<Profile />)

    expect(screen.getByText(profilePageMock.title)).toBeInTheDocument()
    expect(screen.getByText('profile form')).toBeInTheDocument()
  })
})
