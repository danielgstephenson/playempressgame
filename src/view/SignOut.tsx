import { Spinner } from '@chakra-ui/react'
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
  const rightIcon = authState.named === true ? undefined : <Spinner />
  const suffix = authState.displayName == null ? <></> : <>({authState.displayName})</>
  return (
    <ChakraButton
      onClick={signOutToHome}
      loading={authState.signOutLoading}
      errorMessage={authState.signOutErrorMessage}
      rightIcon={rightIcon}
    >
      Sign Out {suffix}
    </ChakraButton>
  )
}
