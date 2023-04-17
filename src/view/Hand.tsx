import { Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Fragment, useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Action from './Action'

export default function HandView (): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const schemeViews = playerState.hand?.map(scheme => {
    if (scheme.id === playerState.trashId || scheme.id === playerState.playId) {
      return <Fragment key={scheme.id} />
    }
    return (
      <VStack key={scheme.id}>
        <Text>{scheme.rank}</Text>
        <Action
          fn='trashScheme'
          label='Trash'
          props={{ schemeId: scheme.id, gameId: gameState.id }}
          m='0px'
        />
        <Action
          fn='playScheme'
          label='Play'
          props={{ schemeId: scheme.id, gameId: gameState.id }}
          m='0'
        />
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
