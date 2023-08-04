import AuthView from './Auth'
import { HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import Curtain from './Curtain'
import Clink from 'clink-react'
import { useParams } from 'react-router-dom'

export default function HeaderView (): JSX.Element {
  const params = useParams()
  const authState = useContext(authContext)
  const inGame = params.gameId != null
  return (
    <HStack justifyContent='space-between'>
      <HStack spacing='20px'>
        <Clink to='/'>Home</Clink>
        <Curtain open={authState.authed}>
          <Clink to='/games'>Games</Clink>
        </Curtain>
        <Curtain open={inGame}>
          <Clink to={`/game/${String(params.gameId)}`} fontWeight='bold'>
            {params.gameId}
          </Clink>
        </Curtain>
      </HStack>
      <AuthView />
    </HStack>
  )
}
