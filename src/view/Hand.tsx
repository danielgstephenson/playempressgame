import { Box, Heading, HStack, Text } from '@chakra-ui/react'
import { Fragment, useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Action from './Action'

export default function HandView (): JSX.Element {
  const playerState = useContext(playerContext)
  const gameState = useContext(gameContext)
  const schemeViews = playerState.hand?.map((scheme, index) => {
    if (index === playerState.trashIndex || index === playerState.playIndex) {
      return <Fragment key={index} />
    }
    return (
      <Box key={index}>
        <Text>{scheme}</Text>
        <Action
          fn='trashScheme'
          label='Trash'
          props={{ handIndex: index, gameId: gameState.id }}
        />
        <Action
          fn='playScheme'
          label='Play'
          props={{ handIndex: index, gameId: gameState.id }}
        />
      </Box>
    )
  })
  return (
    <>
      <Heading size='sm'>Hand</Heading>
      <HStack>
        {schemeViews}
      </HStack>
    </>
  )
}
