import { useContext } from 'react'
import ProfilesView from './Profiles'
import { Text } from '@chakra-ui/react'
import { gameContext } from '../reader/game'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const timeline = gameState.timeline?.map((rank) => <Text key={rank}>{rank}</Text>)
  return (
    <>
      <Text>Phase: {gameState.phase}</Text>
      <Text>Timeline:</Text>
      {timeline}
      <ProfilesView />
    </>
  )
}
