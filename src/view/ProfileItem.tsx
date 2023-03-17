import { Text } from '@chakra-ui/react'
import { profileContext } from '../reader/profile'
import PlayerReader from '../reader/player'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import PlayerView from './Player'

export default function ProfileItemView (): JSX.Element {
  const profileState = useContext(profileContext)
  const gameState = useContext(gameContext)
  const player = gameState.phase !== 'join' && <PlayerReader DocView={PlayerView} />
  return (
    <>
      <Text>Profile: {profileState.userId}</Text>
      {player}
    </>
  )
}
