import { Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Fragment, useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Action from './Action'
import Curtain from './Curtain'

export default function HandView (): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const choice = gameState.choices?.find(choice => choice.playerId === playerState.id)
  const deckChoice = choice?.type === 'deck'
  const trashChoice = choice?.type === 'trash'
  const noChoice = gameState.choices == null || gameState.choices.length === 0
  const playTrash = noChoice && gameState.phase === 'play'
  const playPlay = noChoice && gameState.phase === 'play'
  const schemeViews = playerState.hand?.map(scheme => {
    if (scheme.id === playerState.trashScheme?.id || scheme.id === playerState.playScheme?.id) {
      return <Fragment key={scheme.id} />
    }
    return (
      <VStack key={scheme.id} spacing='0'>
        <Text>{scheme.rank}</Text>
        <Curtain open={playTrash}>
          <Action
            fn='playTrash'
            label='Trash'
            props={{ schemeId: scheme.id, gameId: gameState.id }}
            m='0px'
          />
        </Curtain>
        <Curtain open={playPlay}>
          <Action
            fn='playPlay'
            label='Play'
            props={{ schemeId: scheme.id, gameId: gameState.id }}
          />
        </Curtain>
        <Curtain open={deckChoice}>
          <Action
            fn='deckChoose'
            label='Put on deck'
            props={{ schemeId: scheme.id, gameId: gameState.id }}
          />
        </Curtain>
        <Curtain open={trashChoice}>
          <Action
            fn='trashChoose'
            label='Trash'
            props={{ schemeId: scheme.id, gameId: gameState.id }}
          />
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
