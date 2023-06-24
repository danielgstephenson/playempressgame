import { useContext } from 'react'
import profileContext from '../context/profile'
import StaticCircleAreaView from './StaticCircleArea'

export default function PublicTableauView (): JSX.Element {
  const profileState = useContext(profileContext)
  return (
    <StaticCircleAreaView
      label='Tableau' schemes={profileState.tableau}
    />
  )
}
