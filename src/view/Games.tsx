import { useContext } from 'react'
import { Heading } from '@chakra-ui/react'
import authContext from '../context/auth'
import dbContext from '../context/db'
import functionsContext from '../context/functions'
import GamesContentView from './GamesContent'
import AddGameView from './AddGame'

export default function GamesView (): JSX.Element {
  const dbState = useContext(dbContext)
  const authState = useContext(authContext)
  const functionsState = useContext(functionsContext)
  const content = authState.currentUser != null && dbState.db != null && <GamesContentView db={dbState.db} />
  const addGameView = functionsState.functions != null && authState.currentUser != null && <AddGameView functions={functionsState.functions} />
  return (
    <>
      <Heading>Games {addGameView}</Heading>
      {content}
    </>
  )
}
