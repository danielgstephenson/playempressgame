import { Box, Heading, HStack, Text } from '@chakra-ui/layout'
import { Fragment, useContext } from 'react'
import playContext from '../context/play'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'

export default function CourtView (): JSX.Element {
  const playState = useContext(playContext)
  const gameState = useContext(gameContext)
  if (gameState.court == null || gameState.court.length === 0) {
    return <Text>Empty</Text>
  }
  const group = gameState
    .court
    ?.map(scheme => {
      if (playState.taken == null) {
        return <Fragment key={scheme.id} />
      }
      const taken = playState.taken.includes(scheme.id)
      function handleTake (): void {
        playState.take?.(scheme.id)
      }
      function handleLeave (): void {
        playState.leave?.(scheme.id)
      }
      return (
        <Box key={scheme.id}>
          <Text>{scheme.rank}</Text>
          <Curtain open={!taken}>
            <ChakraButton label='Take' onClick={handleTake} />
          </Curtain>
          <Curtain open={taken}>
            <ChakraButton label='Leave' onClick={handleLeave} />
          </Curtain>
        </Box>
      )
    })
  return (
    <>
      <Heading size='sm'>Court:</Heading>
      <HStack flexWrap='wrap'>{group}</HStack>
    </>
  )
}
