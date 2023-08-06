import { Box, ButtonProps } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import getInPlayStyles from '../service/getInPlayStyles'
import GridButton from './GridButton'

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
    profileState.deckEmpty == null ||
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
    deckEmpty: profileState.deckEmpty,
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
      <GridButton {...restProps}>{rank}</GridButton>
    </Box>
  )
}
