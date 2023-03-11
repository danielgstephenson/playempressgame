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
    return { gameId: profile.gameId, userId: profile.userId }
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
      collectionName='profiles'
      requirements={requirements}
      getRef={({ collectionRef, requirements }) => {
        // const x = requirements?.gameId
        // const y = requirements == null ? null : requirements.gameId

        const q = query(collectionRef, where('gameId', '==', requirements.gameId))
        return q
      }}
    >
      {children}
    </QueryStreamer>
  )
}
