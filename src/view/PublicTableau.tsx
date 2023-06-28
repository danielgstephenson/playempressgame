import { useContext } from 'react'
import profileContext from '../context/profile'
import TinySchemeAreaView from './TinySchemeArea'

export default function PublicTableauView (): JSX.Element {
  const profileState = useContext(profileContext)
  return (
    <TinySchemeAreaView
      label='Play' schemes={profileState.tableau}
    />
  )
}
