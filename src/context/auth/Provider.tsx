import { Auth } from 'firebase/auth'
import { ReactNode } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import authContext from '.'
import useDisplayName from '../../lib/useDisplayName'
import { AuthState } from '../../types'

export default function AuthProvider ({
  auth,
  children
}: {
  auth: Auth
  children: ReactNode
}): JSX.Element {
  const [currentUser, currentUserLoading, currentUserError] = useAuthState(auth)
  const displayName = useDisplayName(auth)
  const authed = currentUser != null && displayName != null && currentUserError == null
  const state: AuthState = { auth, authed, currentUser, currentUserLoading, currentUserError, displayName }
  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}
