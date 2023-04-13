import { Auth } from 'firebase/auth'
import { ReactNode } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import authContext, { AuthState } from '.'

export default function AuthProvider ({
  auth,
  children
}: {
  auth: Auth
  children: ReactNode
}): JSX.Element {
  const [currentUser, currentUserLoading, currentUserError] = useAuthState(auth)
  const authed = currentUser != null
  const state: AuthState = { auth, authed, currentUser, currentUserLoading, currentUserError }
  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}
