import { AuthService } from '@services/auth.service'
import { endSession } from '@utils/end-session'

/** Ends the local session even if the logout request fails. */
export const useLogout = () => {
  const logout = async () => {
    try {
      await AuthService.logout()
    } catch {
      // the local session ends even if the API doesn't respond
    }
    endSession()
  }

  return { logout }
}
