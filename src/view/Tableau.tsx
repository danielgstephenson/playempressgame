import { useContext } from 'react'
import profileContext from '../context/profile'
import CardStackView from './CardStack'

export default function TableauView (): JSX.Element {
  const profileState = useContext(profileContext)
  return (
    <CardStackView label='Tableau' cardGroup={profileState.tableau} />
  )
}
