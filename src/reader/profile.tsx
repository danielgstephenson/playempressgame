import { query, where } from 'firebase/firestore'
import { FC, Fragment, ReactNode, useContext } from 'react'
import { Profile } from '../types'
import dbContext from '../context/db'
import { gameContext } from './game'
import createChakraReaders from '../lib/fireread/createReaders/chakra'
import authContext from '../context/auth'

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
      deckEmpty: profile.deckEmpty,
      topDiscard: profile.topDiscard,
      trashEmpty: profile.trashEmpty,
      playEmpty: profile.playEmpty,
      ready: profile.ready
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
      deckEmpty: data.deckEmpty,
      topDiscard: data.topDiscard,
      trashEmpty: data.trashEmpty,
      playEmpty: data.playEmpty,
      ready: data.ready
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
  const authState = useContext(authContext)
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
      transformDocs={(docs) => {
        if (docs == null) {
          return docs
        }
        const currentProfile = docs.find((doc) => doc.userId === authState.currentUser?.uid)
        if (currentProfile == null) {
          return docs
        }
        const otherProfiles = docs.filter((doc) => doc.userId !== authState.currentUser?.uid)
        const sortedProfiles = [currentProfile, ...otherProfiles]
        return sortedProfiles
      }}
    >
      {children}
    </QueryReader>
  )
}
