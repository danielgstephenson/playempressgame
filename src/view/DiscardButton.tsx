import { useDisclosure, Button } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import getBg from '../service/getBg'
import SchemeModal from './SchemeModal'

export default function DiscardButtonView (): JSX.Element {
  const profileState = useContext(profileContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  if (profileState.topDiscardScheme == null) {
    return <></>
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
