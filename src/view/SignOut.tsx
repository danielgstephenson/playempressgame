import { useContext } from 'react'
import { useSignOut } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import authContext from '../context/auth'
import ChakraButton from '../lib/firewrite/chakra/Button'

export default function SignOutView (): JSX.Element {
  const navigate = useNavigate()
  const authState = useContext(authContext)
  if (authState.auth == null) throw new Error('Auth is null')
  const [signOut, signOutLoading, signOutError] = useSignOut(authState.auth)
  async function signOutToHome (): Promise<void> {
    await signOut()
    navigate('/')
  }
  const displayName = String(authState.displayName)
  const label = `Sign Out (${displayName})`
  return <ChakraButton label={label} onClick={signOutToHome} loading={signOutLoading} error={signOutError} />
}
