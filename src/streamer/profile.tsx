import { query, where } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { Profile } from '../types'
import ProfileItemView from '../view/ProfileItem'
import dbContext from '../context/db'
import { gameContext } from './game'
import streamChakraFire from '../streamFire/chakra'

export const {
  docContext: profileContext,
  DocProvider: ProfileProvider,
  QueryStreamer
} = streamChakraFire<Profile>({
  collectionName: 'profiles',
  toFirestore: (profile) => {
    const data: Profile = { gameId: profile.gameId, userId: profile.userId }
    return data
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    const profile = { id: snapshot.id, gameId: data.gameId, userId: data.userId }
    return profile
  }
})

export default function ProfilesStreamer ({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const gameState = useContext(gameContext)
  const requirements = { gameId: gameState.id }

  return (
    <QueryStreamer
      DocView={ProfileItemView}
      db={dbState.db}
      requirements={requirements}
      getQuery={({ collectionRef, requirements }) => {
        const q = query(collectionRef, where('gameId', '==', requirements.gameId))
        return q
      }}
    >
      {children}
    </QueryStreamer>
  )
}
