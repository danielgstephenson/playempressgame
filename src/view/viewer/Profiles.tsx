import { useContext } from 'react'
import profilesContext from '../../context/profiles'
import ProfileItemView from '../ProfileItem'
import CollectionViewer from './Collection'

export default function ProfilesViewer (): JSX.Element {
  const profilesState = useContext(profilesContext)
  if (profilesState.profilesStream == null) return <></>
  return <CollectionViewer stream={profilesState.profilesStream} View={ProfileItemView} />
}
