import { createContext } from 'react'
import { FirestoreError, QuerySnapshot } from 'firebase/firestore'
import { Profile } from '../../types'

export interface ProfilesState {
  profilesStream?: [Profile[] | undefined, boolean, FirestoreError | undefined, QuerySnapshot<Profile> | undefined]
  profiles?: Profile[]
  profilesLoading?: Boolean
  profilesError?: FirestoreError
}

const profilesContext = createContext<ProfilesState>({})
export default profilesContext
