import AuthView from './Auth'
import { HStack } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import Curtain from './Curtain'
import Clink from 'clink-react'

export default function HeaderView (): JSX.Element {
  const authState = useContext(authContext)
  return (
    <HStack spacing='20px'>
      <AuthView />
      <Clink to='/'>Home</Clink>
      <Curtain open={authState.authed}>
        <Clink to='/games'>Games</Clink>
      </Curtain>
    </HStack>
  )
}
