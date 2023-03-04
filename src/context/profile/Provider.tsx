import { ReactNode } from 'react'
import { Profile } from '../../types'
import profileContext, { ProfileState } from '.'

export default function ProfileProvider ({
  children,
  profile
}: {
  children: ReactNode
  profile: Profile
}): JSX.Element {
  const state: ProfileState = { profile, gameId: profile.gameId, userId: profile.userId }
  return (
    <profileContext.Provider value={state}>
      {children}
    </profileContext.Provider>
  )
}
