import { WarningIcon } from '@chakra-ui/icons'
import { MenuItem, Spinner } from '@chakra-ui/react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import authContext from '../context/auth'
import PopoverIconButtonView from './PopoverIconButton'

export default function SignOutView (): JSX.Element {
  const navigate = useNavigate()
  const authState = useContext(authContext)
  if (authState.auth == null) throw new Error('Auth is null')
  async function signOutToHome (): Promise<void> {
    await authState.unauth?.()
    navigate('/')
  }
  const loadingSpinner = authState.signOutLoading === true && <Spinner />
  const errorButton = authState.signOutErrorMessage != null && (
    <PopoverIconButtonView aria-label={authState.signOutErrorMessage} icon={<WarningIcon />}>
      {authState.signOutErrorMessage}
    </PopoverIconButtonView>
  )
  return (
    <MenuItem
      onClick={signOutToHome}
    >
      Sign Out
      {' '}
      {loadingSpinner}
      {errorButton}
    </MenuItem>
  )
}
