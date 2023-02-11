import { Auth, User } from 'firebase/auth'
import { ReactNode } from 'react'
// import { useAuthState } from 'react-firebase-hooks/auth'

import authContext from '.'

export default function AuthProvider ({
  auth,
  user,
  children
}: {
  auth: Auth
  user?: User | null
  children: ReactNode
}): JSX.Element {
  const state = { auth, user }

  return (
    <authContext.Provider value={state}>
      {children}
    </authContext.Provider>
  )
}
