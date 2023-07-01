import { useDisclosure, Button } from '@chakra-ui/react'
import { useContext } from 'react'
import { BUTTON_GRAY_BORDER } from '../constants'
import profileContext from '../context/profile'
import getBg from '../service/getBg'
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
  const bg = getBg({ rank: profileState.topDiscardScheme.rank })
  return (
    <>
      <Button bg={bg} onClick={onOpen}>
        {profileState.topDiscardScheme.rank}
      </Button>
      <SchemeModal isOpen={isOpen} onClose={onClose} rank={profileState.topDiscardScheme.rank} />
    </>
  )
}
