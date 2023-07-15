import { useDisclosure, Button } from '@chakra-ui/react'
import { useContext } from 'react'
import { BUTTON_GRAY_BORDER } from '../constants'
import profileContext from '../context/profile'
import getInDiscardStyles from '../service/getInDiscardStyles'
import PopoverButtonView from './PopoverButton'
import SchemeModal from './SchemeModal'

export default function DiscardButtonView (): JSX.Element {
  const profileState = useContext(profileContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  if (profileState.topDiscardScheme == null) {
    return (
      <PopoverButtonView bg='transparent' border={BUTTON_GRAY_BORDER}>
        {profileState.displayName}'s discard is empty
      </PopoverButtonView>
    )
  }
  console.log('profileState', profileState)
  const styles = getInDiscardStyles({
    discardId: profileState.topDiscardScheme.id,
    discardRank: profileState.topDiscardScheme.rank,
    playId: profileState.playScheme?.id
  })
  console.log('styles', styles)
  return (
    <>
      <Button {...styles} onClick={onOpen}>
        {profileState.topDiscardScheme.rank}
      </Button>
      <SchemeModal isOpen={isOpen} onClose={onClose} rank={profileState.topDiscardScheme.rank} />
    </>
  )
}
