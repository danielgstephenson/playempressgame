import { ButtonGroup, Heading } from '@chakra-ui/react'
import { MouseEvent, Fragment, useContext } from 'react'
import playContext from '../context/play'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Cloud from './Cloud'
import Curtain from './Curtain'
import SchemesContainerView from './SchemesContainer'
import { SortableList } from './SortableList'
import SortablesView from './Sortables'
import SortableSchemeView from './SortableScheme'

function stop (event: MouseEvent<HTMLButtonElement>): void {
  console.log('stop')
  event.preventDefault()
  event.stopPropagation()
}

export default function HandView (): JSX.Element {
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
  const schemeViews = playState.hand?.map((scheme, index) => {
    if (scheme.id === playState.trashSchemeId || scheme.id === playState.playSchemeId) {
      return <Fragment key={scheme.id} />
    }
    function handleTrash (): void {
      playState.trash?.(scheme.id)
    }
    function handlePlay (): void {
      playState.play?.(scheme.id)
    }
    return (
      <SortableSchemeView
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
        index={index}
      >
        <ButtonGroup>
          <Curtain open={showPlay}>
            <ChakraButton size='xs' onMouseDown={stop} color='black' onClick={handleTrash}>Trash</ChakraButton>
          </Curtain>
          <Curtain open={showPlay}>
            <ChakraButton size='xs' onMouseDown={stop} color='black' onClick={handlePlay}>Play</ChakraButton>
          </Curtain>
          <Curtain open={deckChoice}>
            <Cloud
              fn='deckChoose'
              onMouseDown={stop}
              props={{ schemeId: scheme.id, gameId: gameState.id }}
              color='black'
              size='xs'
            >
              Put on deck
            </Cloud>
          </Curtain>
          <Curtain open={trashChoice}>
            <Cloud
              fn='trashChoose'
              onMouseDown={stop}
              props={{ schemeId: scheme.id, gameId: gameState.id }}
              color='black'
              size='xs'
            >
              Trash
            </Cloud>
          </Curtain>
        </ButtonGroup>
      </SortableSchemeView>
    )
  })
  return (
    <>
      <Heading size='sm'>Hand</Heading>
      <SortablesView
        items={playState.hand}
        setItems={playState.setHand}
      >
        <SchemesContainerView>
          {schemeViews}
        </SchemesContainerView>
      </SortablesView>
      <SortableList />
    </>
  )
}
