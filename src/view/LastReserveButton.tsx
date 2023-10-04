import { useDisclosure, Button } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import getLastReserveStyles from '../service/getLastReserveStyles'
import SchemeModal from './SchemeModal'

export default function LastReserveButtonView (): JSX.Element {
  const profileState = useContext(profileContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  if (profileState.lastReserve == null) {
    return (
      <></>
    )
  }
  const styles = getLastReserveStyles({
    lastReserveId: profileState.lastReserve.id,
    lastReserveRank: profileState.lastReserve.rank,
    playId: profileState.playScheme?.id
  })
  return (
    <>
      <Button {...styles} onClick={onOpen} minW='30px'>
        {profileState.lastReserve.rank}
      </Button>
      <SchemeModal isOpen={isOpen} onClose={onClose} rank={profileState.lastReserve.rank} />
    </>
  )
}
