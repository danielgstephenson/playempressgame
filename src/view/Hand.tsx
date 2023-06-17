import { ButtonGroup, Heading, Stack } from '@chakra-ui/react'
import { Fragment, useContext } from 'react'
import playContext from '../context/play'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Cloud from './Cloud'
import Curtain from './Curtain'
import SchemeView from './Scheme'

export default function HandView (): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  const deckChoice = choice?.type === 'deck'
  const trashChoice = choice?.type === 'trash'
  const noChoice = gameState.choices == null || gameState.choices.length === 0
  const showPlay = noChoice && gameState.phase === 'play' && playerState.playReady !== true
  const unplayed = playerState
    .hand
    ?.filter(scheme =>
      scheme.id !== playState.trashScheme?.id &&
      scheme.id !== playState.playScheme?.id
    )
  const schemeViews = unplayed?.map(scheme => {
    if (scheme.id === playerState.trashScheme?.id || scheme.id === playerState.playScheme?.id) {
      return <Fragment key={scheme.id} />
    }
    function handleTrash (): void {
      playState.trash?.(scheme)
    }
    function handlePlay (): void {
      playState.play?.(scheme)
    }
    return (
      <SchemeView key={scheme.id} rank={scheme.rank} minW='100%'>
        <ButtonGroup>
          <Curtain open={showPlay}>
            <ChakraButton color='black' onClick={handleTrash}>Trash</ChakraButton>
          </Curtain>
          <Curtain open={showPlay}>
            <ChakraButton color='black' onClick={handlePlay}>Play</ChakraButton>
          </Curtain>
          <Curtain open={deckChoice}>
            <Cloud
              fn='deckChoose'
              props={{ schemeId: scheme.id, gameId: gameState.id }}
              color='black'
            >
              Put on deck
            </Cloud>
          </Curtain>
          <Curtain open={trashChoice}>
            <Cloud
              fn='trashChoose'
              props={{ schemeId: scheme.id, gameId: gameState.id }}
              color='black'
            >
              Trash
            </Cloud>
          </Curtain>
        </ButtonGroup>
      </SchemeView>
    )
  })
  return (
    <>
      <Heading size='sm'>Hand</Heading>
      <Stack>
        {schemeViews}
      </Stack>
    </>
  )
}
