import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import authContext from '../context/auth'
import ChakraButton from '../lib/firewrite/chakra/Button'

export default function SignOutView (): JSX.Element {
  const navigate = useNavigate()
  const authState = useContext(authContext)
  if (authState.auth == null) throw new Error('Auth is null')
  async function signOutToHome (): Promise<void> {
    await authState.unauth?.()
    navigate('/')
  }
  const displayName = String(authState.displayName)
  const label = `Sign Out (${displayName})`
  return (
    <ChakraButton
      label={label}
      onClick={signOutToHome}
      loading={authState.unauthLoading}
      errorMessage={authState.signOutErrorMessage}
    />
  )
}
