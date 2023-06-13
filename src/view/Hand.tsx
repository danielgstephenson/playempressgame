import { Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Fragment, useContext } from 'react'
import playContext from '../context/play'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Cloud from './Cloud'
import Curtain from './Curtain'

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
    ?.reverse()
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
      <VStack key={scheme.id} spacing='0'>
        <Text>{scheme.rank}</Text>
        <Curtain open={showPlay}>
          <ChakraButton onClick={handleTrash}>Trash</ChakraButton>
        </Curtain>
        <Curtain open={showPlay}>
          <ChakraButton onClick={handlePlay}>Play</ChakraButton>
        </Curtain>
        <Curtain open={deckChoice}>
          <Cloud
            fn='deckChoose'
            props={{ schemeId: scheme.id, gameId: gameState.id }}
          >
            Put on deck
          </Cloud>
        </Curtain>
        <Curtain open={trashChoice}>
          <Cloud
            fn='trashChoose'
            props={{ schemeId: scheme.id, gameId: gameState.id }}
          >
            Trash
          </Cloud>
        </Curtain>
      </VStack>
    )
  })
  return (
    <>
      <Heading size='sm'>Hand</Heading>
      <HStack flexWrap='wrap'>
        {schemeViews}
      </HStack>
    </>
  )
}
