import { query, where } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import getProfilesRef from '../service/profile'
import { Profile } from '../types'
import ProfileItemView from '../view/ProfileItem'
import dbContext from '../context/db'
import { gameContext } from './game'
import streamChakraFire from '../streamFire/chakra'

export const {
  docContext: profileContext,
  DocProvider: ProfileProvider,
  QueryStreamer
} = streamChakraFire<Profile>()

export default function ProfilesStreamer ({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const gameState = useContext(gameContext)
  const requirements = { db: dbState.db, gameId: gameState.id }

  return (
    <QueryStreamer
      DocView={ProfileItemView}
      requirements={requirements}
      getRef={(requirements) => {
        const profilesCollection = getProfilesRef(requirements.db)
        const q = query(profilesCollection, where('gameId', '==', requirements.gameId))
        return q
      }}
    >
      {children}
    </QueryStreamer>
  )
}
