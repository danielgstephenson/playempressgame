import { Text } from '@chakra-ui/react'
import { profileContext } from '../reader/profile'
import PlayerReader from '../reader/player'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PlayerView from './Player'

export default function ProfileItemView (): JSX.Element {
  const profileState = useContext(profileContext)
  const gameState = useContext(gameContext)
  const playing = gameState.phase !== 'join'
  return (
    <Curtain open={playing} openElement={<PlayerReader DocView={PlayerView} />}>
      <Text>Profile: {profileState.userId}</Text>
    </Curtain>
  )
}
