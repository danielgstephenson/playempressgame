import { Heading } from '@chakra-ui/react'
import GamesContentView from './GamesContent'
import AddGameView from './AddGame'

export default function GamesView (): JSX.Element {
  return (
    <>
      <Heading>Games <AddGameView /></Heading>
      <GamesContentView />
    </>
  )
}
