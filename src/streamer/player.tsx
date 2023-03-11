import { collection, where, query } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { playerConverter } from '../service/player'
import { Player } from '../types'
import PlayerView from '../view/Player'
import dbContext from '../context/db'
import { profileContext } from './profile'
import streamChakraFire from '../streamFire/chakra'

export const { QueryStreamer, queryContext: playerContext } = streamChakraFire<Player>()

export default function PlayerStreamer ({
  children
}: {
  children?: ReactNode
}): JSX.Element {
  const profileState = useContext(profileContext)
  const dbState = useContext(dbContext)
  const requirements = { db: dbState.db, gameId: profileState.gameId, userId: profileState.userId }
  return (
    <QueryStreamer
      DocView={PlayerView}
      requirements={requirements}
      getRef={(requirements) => {
        const playersCollection = collection(requirements.db, 'players')
        const playersConverted = playersCollection.withConverter(playerConverter)
        const whereGame = where('gameId', '==', requirements.gameId)
        const whereUser = where('userId', '==', requirements.userId)
        const q = query(playersConverted, whereGame, whereUser)
        return q
      }}
    >
      {children}
    </QueryStreamer>
  )
}
