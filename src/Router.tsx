import { Routes, Route } from 'react-router-dom'
import GamesView from './view/Games'
import LayoutView from './view/Layout'
import GamePageView from './view/page/Game'
import HomePageView from './view/page/Home'

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
