import { Routes, Route } from 'react-router-dom'
import GamesView from './Games'
import LayoutView from './Layout'
import GamePageView from './page/Game'
import HomePageView from './page/Home'

export default function RouterView (): JSX.Element {
  return (
    <Routes>
      <Route path='/' element={<LayoutView />}>
        <Route index element={<HomePageView />} />
        <Route path='games' element={<GamesView />} />
        <Route path='game/:gameId' element={<GamePageView />} />
      </Route>
    </Routes>
  )
}
