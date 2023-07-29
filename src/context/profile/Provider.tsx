import profileContext from '.'
import { Profile } from '../../types'

export default function ProfileProvider ({ profile, children }: {
  profile: Partial<Profile>
  children: React.ReactNode
}): JSX.Element {
  return (
    <profileContext.Provider value={profile}>
      {children}
    </profileContext.Provider>
  )
}
