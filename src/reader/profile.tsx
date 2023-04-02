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
} = createChakraReaders<Profile>({ collectionName: 'profiles' })

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
        const whereGame = where('gameId', '==', requirements.gameId)
        const q = query(collectionRef, whereGame)
        return q
      }}
      transformDocs={(docs) => {
        console.log('docs test:', docs)
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
