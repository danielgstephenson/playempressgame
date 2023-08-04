import { ChevronDownIcon } from '@chakra-ui/icons'
import { Menu, MenuButton, Button, MenuList, Spinner } from '@chakra-ui/react'
import { useContext } from 'react'
import authContext from '../context/auth'
import CreateAccountView from './CreateAccount'
import SignOutView from './SignOut'

export default function AuthView (): JSX.Element {
  const authState = useContext(authContext)
  if (authState.currentUser == null) {
    return <CreateAccountView />
  } else {
    const name = authState.named === true ? authState.displayName : <Spinner size='sm' />
    const menuProps = authState.signOutLoading === true ? { isOpen: true } : {}
    return (
      <Menu {...menuProps}>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {name}
        </MenuButton>
        <MenuList>
          <SignOutView />
        </MenuList>
      </Menu>
    )
  }
}
