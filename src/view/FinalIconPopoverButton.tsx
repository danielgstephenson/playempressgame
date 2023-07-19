import { StarIcon } from '@chakra-ui/icons'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import PopoverIconButton from './PopoverIconButton'

export default function FinalIconPopoverButtonView (): JSX.Element {
  const gameState = useContext(gameContext)
  if (gameState.final === true) {
    return (
      <PopoverIconButton aria-label='Final round' icon={<StarIcon />}>
        This is the final play.
      </PopoverIconButton>
    )
  }
  return <></>
}
