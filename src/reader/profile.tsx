import { query, where } from 'firebase/firestore'
import { FC, Fragment, ReactNode, useContext } from 'react'
import { Profile } from '../types'
import dbContext from '../context/db'
import { gameContext } from './game'
import createChakraReaders from '../lib/fireread/createReaders/chakra'

export const {
  docContext: profileContext,
  QueryReader
} = createChakraReaders<Profile>({
  collectionName: 'profiles',
  toFirestore: (profile) => {
    const data = {
      gameId: profile.gameId,
      userId: profile.userId,
      displayName: profile.displayName,
      gold: profile.gold,
      topDiscard: profile.topDiscard
    }
    return data
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    const profile = {
      id: snapshot.id,
      gameId: data.gameId,
      userId: data.userId,
      displayName: data.displayName,
      gold: data.gold,
      topDiscard: data.topDiscard
    }
    return profile
  }
})

export default function ProfilesReader ({
  children,
  DocView
}: {
  children?: ReactNode
  DocView: FC
}): JSX.Element {
  const dbState = useContext(dbContext)
  const gameState = useContext(gameContext)
  const requirements = { gameId: gameState.id }

  return (
    <QueryReader
      DocView={DocView}
      db={dbState.db}
      EmptyView={Fragment}
      requirements={requirements}
      getQuery={({ collectionRef, requirements }) => {
        const q = query(collectionRef, where('gameId', '==', requirements.gameId))
        return q
      }}
    >
      {children}
    </QueryReader>
  )
}
