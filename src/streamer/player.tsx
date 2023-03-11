import { where, query } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import getPlayersRef from '../service/player'
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
        const playersCollection = getPlayersRef(requirements.db)
        const whereGame = where('gameId', '==', requirements.gameId)
        const whereUser = where('userId', '==', requirements.userId)
        const q = query(playersCollection, whereGame, whereUser)
        return q
      }}
    >
      {children}
    </QueryStreamer>
  )
}
