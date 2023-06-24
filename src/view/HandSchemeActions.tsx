import { ButtonGroup } from '@chakra-ui/react'
import { MouseEvent, useContext } from 'react'
import playContext from '../context/play'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import handleStop from '../service/handleStop'
import Cloud from './Cloud'
import Curtain from './Curtain'

export default function HandSchemeActions ({ id }: {
  id: string
}): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  if (playState.hand == null || playState.setHand == null) {
    return <></>
  }
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  const deckChoice = choice?.type === 'deck'
  const trashChoice = choice?.type === 'trash'
  const noChoice = gameState.choices == null || gameState.choices.length === 0
  const showPlay = noChoice && gameState.phase === 'play' && playerState.playReady !== true
  function handleTrash (event: MouseEvent<HTMLButtonElement>): void {
    handleStop(event)
    playState.trash?.(id)
  }
  function handlePlay (event: MouseEvent<HTMLButtonElement>): void {
    handleStop(event)
    playState.play?.(id)
  }
  return (
    <ButtonGroup>
      <Curtain open={showPlay}>
        <ChakraButton
          size='xs'
          color='black'
          onMouseDown={handleStop}
          onClick={handleTrash}
        >
          Trash
        </ChakraButton>
      </Curtain>
      <Curtain open={showPlay}>
        <ChakraButton
          size='xs'
          color='black'
          onClick={handlePlay}
        >
          Play
        </ChakraButton>
      </Curtain>
      <Curtain open={deckChoice}>
        <Cloud
          fn='deckChoose'
          props={{ schemeId: id, gameId: gameState.id }}
          color='black'
          size='xs'
        >
          Put on deck
        </Cloud>
      </Curtain>
      <Curtain open={trashChoice}>
        <Cloud
          fn='trashChoose'
          props={{ schemeId: id, gameId: gameState.id }}
          color='black'
          size='xs'
        >
          Trash
        </Cloud>
      </Curtain>
    </ButtonGroup>
  )
}
