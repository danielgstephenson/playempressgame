import { collection, where, query } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { playerConverter } from '../service/player'
import { Player } from '../types'
import PlayerView from '../view/Player'
import dbContext from '../context/db'
import { profileContext } from './profile'
import streamChakraFire from '../streamFire/chakra'
import getSafe from './getSafe'

export const { QueryStreamer, queryContext: playerContext } = streamChakraFire<Player>()

export default function PlayerStreamer ({
  children
}: {
  children?: ReactNode
}): JSX.Element {
  const profileState = useContext(profileContext)
  const dbState = useContext(dbContext)
  const ref = getSafe({
    needs: { db: dbState.db, gameId: profileState.gameId, userId: profileState.userId },
    getter: (needs) => {
      const playersCollection = collection(needs.db, 'players')
      const playersConverted = playersCollection.withConverter(playerConverter)
      const whereGame = where('gameId', '==', needs.gameId)
      const whereUser = where('userId', '==', needs.userId)
      const q = query(playersConverted, whereGame, whereUser)
      return q
    }
  })
  return <QueryStreamer DocView={PlayerView} queryRef={ref}>{children}</QueryStreamer>
}
