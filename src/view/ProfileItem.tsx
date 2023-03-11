import { Text } from '@chakra-ui/react'
import { profileContext } from '../streamer/profile'
import PlayerStreamer from '../streamer/player'
import { useContext } from 'react'
import { gameContext } from '../streamer/game'

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
