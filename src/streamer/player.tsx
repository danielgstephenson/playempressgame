import { where, query } from 'firebase/firestore'
import { ReactNode, useContext } from 'react'
import { Player } from '../types'
import PlayerView from '../view/Player'
import dbContext from '../context/db'
import { profileContext } from './profile'
import streamChakraFire from '../streamFire/chakra'

export const { QueryStreamer, queryContext: playerContext } = streamChakraFire<Player>({
  collectionName: 'players',
  toFirestore: (player) => {
    return {
      deck: player.deck,
      discard: player.discard,
      gameId: player.gameId,
      hand: player.hand,
      userId: player.userId
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    const player = {
      id: snapshot.id,
      deck: data.deck,
      discard: data.discard,
      gameId: data.gameId,
      hand: data.hand,
      userId: data.userId
    }
    return player
  }
})

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
      db={dbState.db}
      collectionName='players'
      requirements={requirements}
      getRef={({ collectionRef, requirements }) => {
        const whereGame = where('gameId', '==', requirements.gameId)
        const whereUser = where('userId', '==', requirements.userId)
        const q = query(collectionRef, whereGame, whereUser)
        return q
      }}
    >
      {children}
    </QueryStreamer>
  )
}
