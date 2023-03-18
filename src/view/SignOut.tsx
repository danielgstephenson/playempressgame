import { Auth } from 'firebase/auth'
import { useSignOut } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import ChakraButton from '../lib/firewrite/chakra/Button'

export default function SignOutView ({ auth }: {
  auth: Auth
}): JSX.Element {
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  const navigate = useNavigate()
  async function signOutToHome (): Promise<void> {
    await signOut()
    navigate('/')
  }
  return <ChakraButton label='Sign Out' onClick={signOutToHome} loading={signOutLoading} error={signOutError} />
}
