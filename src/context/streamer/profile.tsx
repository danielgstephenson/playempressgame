import { Query, collection, query, where } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { profileConverter } from '../../service/profile'
import { Profile } from '../../types'
import ProfileItemView from '../../view/ProfileItem'
import dbContext from '../db'
import { gameContext } from './game'
import getFirestream from './getFirestream'

export const {
  docContext: profileContext,
  DocProvider: ProfileProvider,
  QueryStreamer
} = getFirestream<Profile>()

export default function ProfilesStreamer ({
  children
}: {
  children: ReactNode
}): JSX.Element {
  const dbState = useContext(dbContext)
  const gameState = useContext(gameContext)
  function getQuery (): Query<Profile> | undefined {
    if (dbState.db == null || gameState.id == null) return undefined
    const profilesCollection = collection(dbState.db, 'profiles')
    const profilesConverted = profilesCollection.withConverter(profileConverter)
    const q = query(profilesConverted, where('gameId', '==', gameState.id))
    return q
  }
  const q = getQuery()
  return <QueryStreamer View={ProfileItemView} queryRef={q}>{children}</QueryStreamer>
}
