import { useDisclosure } from '@chakra-ui/react'
import { useContext } from 'react'
import profileContext from '../context/profile'
import getLastReserveStyles from '../service/getLastReserveStyles'
import ProfileSchemeButtonView from './ProfileSchemeButton'
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
      <ProfileSchemeButtonView rank={profileState.lastReserve.rank} {...styles} onClick={onOpen} size='xs' />
      <SchemeModal isOpen={isOpen} onClose={onClose} rank={profileState.lastReserve.rank} />
    </>
  )
}
