import { Heading } from '@chakra-ui/react'
import GamesContentView from './GamesContent'
import AddGameWriter from './writer/AddGame'

export default function GamesView (): JSX.Element {
  return (
    <>
      <Heading>Games <AddGameWriter /></Heading>
      <GamesContentView />
    </>
  )
}
