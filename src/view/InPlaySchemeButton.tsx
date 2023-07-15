import { ButtonProps } from '@chakra-ui/react'
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
  const styles = getInPlayStyles({
    bid: profileState.bid,
    court: gameState.court,
    dungeon: gameState.dungeon,
    profiles: gameState.profiles,
    rank,
    schemeId: id,
    userId: profileState.userId
  })
  return <GridButton {...styles} {...restProps}>{rank}</GridButton>
}
