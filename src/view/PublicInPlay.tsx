import { useContext } from 'react'
import profileContext from '../context/profile'
import TinySchemeAreaView from './TinySchemeArea'

export default function PublicInPlayView (): JSX.Element {
  const profileState = useContext(profileContext)
  return (
    <TinySchemeAreaView
      label='' schemes={profileState.inPlay}
    />
  )
}
