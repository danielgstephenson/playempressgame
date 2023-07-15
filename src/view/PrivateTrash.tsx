import { HStack, VStack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import ActiveHeading from './ActiveHeading'
import Curtain from './Curtain'
import FinalIconView from './FinalIcon'
import TrashAreaView from './TrashArea'
import TrashChoiceView from './TrashChoiceView'
import TrashHistoryView from './TrashHistory'

export default function PrivateTrashView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const done = gameState.final === true && gameState.profiles?.every(profile => profile.playReady) === true && gameState.choices?.length === 0
  console.log('private trash')
  return (
    <VStack spacing='2px'>
      <ActiveHeading active={playState.overTrash}>
        <HStack alignItems='baseline'><Text>Trash</Text> <FinalIconView /></HStack>
      </ActiveHeading>
      <HStack spacing='2px' alignItems='center'>
        <TrashHistoryView history={playerState.trashHistory} />
        <Curtain open={!done}>
          <VStack spacing='2px' alignItems='start' height='100%' justifyContent='center'>
            <TrashAreaView />
            <TrashChoiceView />
          </VStack>
        </Curtain>
      </HStack>
    </VStack>
  )
}
