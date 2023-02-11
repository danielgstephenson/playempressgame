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
  const state: AuthState = { auth, currentUser, currentUserLoading, currentUserError }

  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}
