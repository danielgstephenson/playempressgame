import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import Cloud from './Cloud'
import SortableSchemes from './SortableSchemes'

export default function DeckView (): JSX.Element {
  const gameState = useContext(gameContext)
  const { deck, setDeck } = useContext(playContext)
  if (deck == null) {
    return <></>
  }
  const schemeIds = deck.map(scheme => scheme.id)
  return (
    <>
      <Heading size='sm'>Deck</Heading>
      <SortableSchemes schemes={deck} setSchemes={setDeck} />
      <Cloud
        fn='reorder'
        props={{ gameId: gameState.id, schemeIds }}
      >
        Ready
      </Cloud>
    </>
  )
}
