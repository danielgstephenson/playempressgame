import { Auth } from 'firebase/auth'
import { ReactNode, useEffect, useState } from 'react'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'

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
  const [
    currentUser, currentUserLoading, currentUserError
  ] = useAuthState(auth)
  const [signOutErrorMessage, setSignOutErrorMessage] = useState<string>()
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  useEffect(() => {
    setSignOutErrorMessage(signOutError?.message)
  }, [signOutError])
  const displayName = useDisplayName(auth)
  const authed = currentUser != null &&
    displayName != null &&
    currentUserError == null
  const state: AuthState = {
    auth,
    authed,
    currentUser,
    currentUserLoading,
    currentUserError,
    displayName,
    setSignOutErrorMessage,
    signOut,
    signOutErrorMessage,
    signOutLoading
  }
  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}
