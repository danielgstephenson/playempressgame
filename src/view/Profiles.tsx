import ProfilesReader from '../reader/profile'
import ProfileView from './Profile'

export default function ProfilesView (): JSX.Element {
  return <ProfilesReader DocView={ProfileView} />
}
