import { useContext } from 'react'
import authContext from '../context/auth'
import CreateAccountView from './CreateAccount'
import SignOutView from './SignOut'

export default function AuthView (): JSX.Element {
  const authState = useContext(authContext)
  if (authState.currentUser == null) {
    return <CreateAccountView />
  } else {
    return <SignOutView />
  }
}
