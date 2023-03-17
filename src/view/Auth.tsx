import { useContext } from 'react'
import { Text } from '@chakra-ui/react'
import authContext from '../context/auth'
import CreateAccountView from './CreateAccount'
import SignOutView from './SignOut'

export default function AuthView (): JSX.Element {
  const authState = useContext(authContext)
  if (authState.auth == null) {
    return <Text>Auth state is null</Text>
  }
  if (authState.currentUser == null) {
    return <CreateAccountView auth={authState.auth} />
  }
  return <SignOutView auth={authState.auth} />
}
