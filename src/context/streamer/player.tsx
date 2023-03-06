import { Query, collection, where, query } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { playerConverter } from '../../service/player'
import { Player } from '../../types'
import PlayerView from '../../view/Player'
import dbContext from '../db'
import { profileContext } from './profile'
import getFirestream from './getFirestream'

export const { QueryStreamer, queryContext: playerContext } = getFirestream<Player>()

export default function ProfilesStreamer ({
  children
}: {
  children?: ReactNode
}): JSX.Element {
  const profileState = useContext(profileContext)
  const dbState = useContext(dbContext)
  function getRef (): Query<Player> | undefined {
    if (dbState.db == null || profileState.gameId == null || profileState.userId == null) {
      return undefined
    }
    const playersCollection = collection(dbState.db, 'players')
    const playersConverted = playersCollection.withConverter(playerConverter)
    const whereGame = where('gameId', '==', profileState.gameId)
    const whereUser = where('userId', '==', profileState.userId)
    const q = query(playersConverted, whereGame, whereUser)
    return q
  }
  const ref = getRef()
  return <QueryStreamer View={PlayerView} queryRef={ref}>{children}</QueryStreamer>
}
