import { LockIcon } from '@chakra-ui/icons'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import PopoverIconButton from './PopoverIconButton'

export default function ImprisonedButton (): JSX.Element | null {
  const gameState = useContext(gameContext)
  const message = 'The highest schemes in play were imprisoned'
  const visibility = gameState.imprisoned === true ? 'visible' : 'hidden'
  return (
    <PopoverIconButton fontSize='xs' size='xs' aria-label={message} icon={<LockIcon />} visibility={visibility}>
      {message}
    </PopoverIconButton>
  )
}
