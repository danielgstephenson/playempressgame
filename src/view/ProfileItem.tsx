import { Text } from '@chakra-ui/react'
import { profileContext } from '../reader/profile'
import PlayerStreamer from '../reader/player'
import { useContext } from 'react'
import { gameContext } from '../reader/game'

export default function ProfileItemView (): JSX.Element {
  const profileState = useContext(profileContext)
  const gameState = useContext(gameContext)
  const player = gameState.phase !== 'join' && <PlayerStreamer />
  return (
    <>
      <Text>Profile: {profileState.userId}</Text>
      {player}
    </>
  )
}
