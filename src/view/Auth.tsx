import { useContext } from 'react'
import { Button, Spinner } from '@chakra-ui/react'
import authContext from '../context/auth'
import CreateAccountView from './CreateAccount'
import SignOutView from './SignOut'

export default function AuthView (): JSX.Element {
  const authState = useContext(authContext)
  if (authState.authed === true) {
    return <SignOutView />
  }
  if (authState.currentUser == null) {
    return <CreateAccountView />
  }
  return (
    <Button isDisabled>
      <Spinner />
    </Button>
  )
}
