import { collection, query, where } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { profileConverter } from '../service/profile'
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
  const needs = { db: dbState.db, gameId: gameState.id }

  return (
    <QueryStreamer
      DocView={ProfileItemView}
      refNeeds={needs}
      getRef={(needs) => {
        const profilesCollection = collection(needs.db, 'profiles')
        const profilesConverted = profilesCollection.withConverter(profileConverter)
        const q = query(profilesConverted, where('gameId', '==', needs.gameId))
        return q
      }}
    >
      {children}
    </QueryStreamer>
  )
}
