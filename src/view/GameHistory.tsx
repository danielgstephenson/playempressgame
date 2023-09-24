import { AccordionProps, Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import HistoryView from './History'

export default function GameHistoryView (accordionProps: AccordionProps): JSX.Element {
  const gameState = useContext(gameContext)
  return (
    <>
      <HistoryView events={gameState.events} {...accordionProps}>
        <Heading size='sm'>Game History</Heading>
      </HistoryView>
    </>
  )
}
