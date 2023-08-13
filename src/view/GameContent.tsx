import { useContext, useEffect, useState } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PalaceView from './Palace'
import { Box, Stack } from '@chakra-ui/react'
import TotalView from './Total'
import TimelineView from './Timeline'
import authContext from '../context/auth'
import isTaking from '../service/isTaking'
import functionsContext from '../context/functions'
import useSound from 'use-sound'
import newPlay from '../asset/sound/newPlay.mp3'
import newAuction from '../asset/sound/newAuction.mp3'
import finalNewAuction from '../asset/sound/finalNewAuction.mp3'
import finalNewPlay from '../asset/sound/finalNewPlay.mp3'
import playerJoined from '../asset/sound/playerJoined.mp3'
import isPlaying from '../service/iaPlaying'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const authState = useContext(authContext)
  const functionsState = useContext(functionsContext)
  const [phaseClone, setPhaseClone] = useState(gameState.phase)
  const [profilesCountClone, setProfilesCountClone] = useState(gameState.profiles?.length)
  const [hearNewPlay] = useSound(newPlay, { volume: 0.1 })
  const [hearNewAuction] = useSound(newAuction)
  const [hearFinalNewAuction] = useSound(finalNewAuction)
  const [hearFinalNewPlay] = useSound(finalNewPlay, { volume: 0.1 })
  const [hearPlayerJoined] = useSound(playerJoined, { volume: 0.2 })
  const [alreadyPlaying, setAlreadyPlaying] = useState(isPlaying({ profiles: gameState.profiles, userId: authState.currentUser?.uid }))
  useEffect(() => {
    const nowPlaying = isPlaying({ profiles: gameState.profiles, userId: authState.currentUser?.uid })
    if (nowPlaying !== alreadyPlaying) {
      setAlreadyPlaying(nowPlaying)
    }
  }, [gameState.profiles, authState.currentUser?.uid, alreadyPlaying])
  if (
    gameState.phase == null ||
    authState.currentUser?.uid == null ||
    functionsState.functions == null ||
    gameState.timeline == null ||
    gameState.final == null
  ) return <></>
  const taking = isTaking({ profiles: gameState.profiles, userId: authState.currentUser.uid, choices: gameState.choices })
  const showContent = !taking && gameState.phase !== 'join'
  if (gameState.phase !== phaseClone) {
    setPhaseClone(gameState.phase)
    if (gameState.phase === 'play') {
      if (gameState.final) {
        hearFinalNewPlay()
      } else {
        hearNewPlay()
      }
    }
    if (gameState.phase === 'auction') {
      if (gameState.timeline.length <= 1) {
        hearFinalNewAuction()
      } else {
        hearNewAuction()
      }
    }
  }
  if (gameState.profiles?.length !== profilesCountClone) {
    setProfilesCountClone(gameState.profiles?.length)
    if (
      alreadyPlaying &&
      gameState.profiles?.length != null &&
      gameState.profiles?.length > 1
    ) {
      hearPlayerJoined()
    }
  }
  return (
    <Stack direction='column' flexGrow='1' height='100%' overflow='hidden' spacing='4px'>
      <Box>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Curtain open={showContent}>
            <PalaceView />
            <TotalView />
            <TimelineView />
          </Curtain>
        </Stack>
      </Box>
      <ProfilesView />
    </Stack>
  )
}
