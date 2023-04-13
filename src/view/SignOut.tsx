import { Auth } from 'firebase/auth'
import { useContext } from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import authContext from '../context/auth'
import ChakraButton from '../lib/firewrite/chakra/Button'

export default function SignOutView ({ auth }: {
  auth: Auth
}): JSX.Element {
  const authState = useContext(authContext)
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  const navigate = useNavigate()
  async function signOutToHome (): Promise<void> {
    await signOut()
    navigate('/')
  }
  if (authState.currentUser == null) throw new Error('This user does not exist.')
  if (authState.currentUser.displayName == null) throw new Error('This user does not have a display name.')
  const label = `Sign Out (${authState.currentUser?.displayName})`
  return <ChakraButton label={label} onClick={signOutToHome} loading={signOutLoading} error={signOutError} />
}
