import { collection, query, where } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { profileConverter } from '../service/profile'
import { Profile } from '../types'
import ProfileItemView from '../view/ProfileItem'
import dbContext from '../context/db'
import { gameContext } from './game'
import streamChakraFire from '../streamFire/chakra'
import getSafe from './getSafe'

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
  const q = getSafe({
    needs: { db: dbState.db, gameId: gameState.id },
    getter: (needs) => {
      const profilesCollection = collection(needs.db, 'profiles')
      const profilesConverted = profilesCollection.withConverter(profileConverter)
      const q = query(profilesConverted, where('gameId', '==', needs.gameId))
      return q
    }
  })
  return <QueryStreamer DocView={ProfileItemView} queryRef={q}>{children}</QueryStreamer>
}
