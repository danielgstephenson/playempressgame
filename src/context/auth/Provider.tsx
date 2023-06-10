import { Auth } from 'firebase/auth'
import { ReactNode, useCallback, useEffect, useState } from 'react'
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
  const { displayName, setDisplayName } = useDisplayName(auth)
  const unauthLoading = signOutLoading
  const authed = currentUser != null &&
    currentUserError == null &&
    !unauthLoading

  const unauth = useCallback(async () => {
    const result = await signOut()
    if (result) {
      setDisplayName(undefined)
    } else {
      setSignOutErrorMessage('Sign out failed')
    }
    return result
  }, [signOut, setDisplayName, setSignOutErrorMessage])
  const state: AuthState = {
    auth,
    authed,
    currentUser,
    currentUserLoading,
    currentUserError,
    displayName,
    setSignOutErrorMessage,
    signOutErrorMessage,
    unauth,
    unauthLoading
  }
  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}
