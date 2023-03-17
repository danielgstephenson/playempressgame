import { Auth } from 'firebase/auth'
import { useSignOut } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import ChakraWriting from '../lib/firewrite/chakra/Writing'

export default function SignOutView ({ auth }: {
  auth: Auth
}): JSX.Element {
  const [signOut, signOutLoading, signOutError] = useSignOut(auth)
  const navigate = useNavigate()
  async function signOutToHome (): Promise<void> {
    await signOut()
    navigate('/')
  }
  return <ChakraWriting label='Sign Out' write={signOutToHome} loading={signOutLoading} error={signOutError} />
}
