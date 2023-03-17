import { useContext } from 'react'
import { Text } from '@chakra-ui/react'

import authContext from '../context/auth'
import AuthContentView from './AuthContent'

export default function AuthView (): JSX.Element {
  const authState = useContext(authContext)
  if (authState.auth == null) {
    return <Text>Auth state is null</Text>
  }
  return <AuthContentView auth={authState.auth} user={authState.currentUser} />
}
