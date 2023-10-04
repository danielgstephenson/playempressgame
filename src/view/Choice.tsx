import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'

export default function ChoiceView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  if (gameState.phase === 'auction') {
    return <></>
  }
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  if (choice == null) {
    return <></>
  }
  const labels = {
    reserve: 'Put one scheme from your hand on th left of yor last reserve',
    trash: 'Trash one scheme from your hand'
  }
  const label = labels[choice.type]
  return (
    <Heading size='md' textAlign='center'>{label}</Heading>
  )
}
