import { Box, ButtonProps, VStack } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import getInPlayStyles from '../service/getInPlayStyles'
import GridButton from './GridButton'
import SchemeIcon from './SchemeIcon'

export default function InPlaySchemeButtonView ({
  id,
  rank,
  ...restProps
}: {
  id: string
  rank: number
} & ButtonProps): JSX.Element {
  const profileState = useContext(profileContext)
  const gameState = useContext(gameContext)
  if (
    profileState.bid == null ||
    profileState.reserveLength == null ||
    profileState.userId == null ||
    gameState.court == null ||
    gameState.dungeon == null ||
    gameState.profiles == null ||
    gameState.choices == null ||
    gameState.id == null ||
    gameState.phase == null
  ) {
    return <></>
  }
  const styles = getInPlayStyles({
    bid: profileState.bid,
    choices: gameState.choices,
    court: gameState.court,
    reserveLength: profileState.reserveLength,
    dungeon: gameState.dungeon,
    gameId: gameState.id,
    phase: gameState.phase,
    profiles: gameState.profiles,
    rank,
    schemeId: id,
    userId: profileState.userId
  })
  return (
    <Box {...styles}>
      <GridButton h='fit-content' p='2px' {...restProps}>
        <VStack spacing='1px' pb='1px'>
          <Box>{rank}</Box>
          <SchemeIcon rank={rank} />
        </VStack>
      </GridButton>
    </Box>
  )
}
