import { useContext } from 'react'
import profileContext from '../context/profile'
import StaticAreaView from './StaticArea'

export default function TableauView (): JSX.Element {
  const profileState = useContext(profileContext)
  return (
    <StaticAreaView
      label='Tableau' schemes={profileState.tableau}
    />
  )
}
