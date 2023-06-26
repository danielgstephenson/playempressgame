import { ButtonGroup } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Cloud from './Cloud'
import Curtain from './Curtain'

export default function HandSchemeActions ({ id }: {
  id: string
}): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  const deckChoice = choice?.type === 'deck'
  const trashChoice = choice?.type === 'trash'
  return (
    <ButtonGroup>
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
