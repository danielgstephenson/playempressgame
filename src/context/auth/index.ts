import { createContext } from 'react'
import { Auth, User } from 'firebase/auth'

export interface AuthState {
  auth?: Auth
  authed?: boolean
  currentUser?: User | null
  currentUserLoading?: Boolean
  currentUserError?: Error | undefined
}

const authContext = createContext<AuthState>({})
export default authContext
