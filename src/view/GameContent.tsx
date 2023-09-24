import { useContext, useEffect, useState } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import { Heading, Stack } from '@chakra-ui/react'
import authContext from '../context/auth'
import functionsContext from '../context/functions'
import useSound from 'use-sound'
import newPlay from '../asset/sound/newPlay.mp3'
import newAuction from '../asset/sound/newAuction.mp3'
import finalNewAuction from '../asset/sound/finalNewAuction.mp3'
import finalNewPlay from '../asset/sound/finalNewPlay.mp3'
import playerJoined from '../asset/sound/playerJoined.mp3'
import isPlaying from '../service/iaPlaying'
import useCurrentPlaying from '../use/currentPlaying'
import Curtain from './Curtain'
import CenterView from './Center'
import GameHistoryView from './GameHistory'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const authState = useContext(authContext)
  const functionsState = useContext(functionsContext)
  const [phaseClone, setPhaseClone] = useState(gameState.phase)
  const [profilesCountClone, setProfilesCountClone] = useState(gameState.profiles?.length)
  const [hearNewPlay] = useSound(newPlay, { volume: 0.1 })
  const [hearNewAuction] = useSound(newAuction, { volume: 0.25 })
  const [hearFinalNewAuction] = useSound(finalNewAuction, { volume: 0.5 })
  const [hearFinalNewPlay] = useSound(finalNewPlay, { volume: 0.1 })
  const [hearPlayerJoined] = useSound(playerJoined, { volume: 0.2 })
  const [alreadyPlaying, setAlreadyPlaying] = useState(isPlaying({ profiles: gameState.profiles, userId: authState.currentUser?.uid }))
  useEffect(() => {
    const nowPlaying = isPlaying({ profiles: gameState.profiles, userId: authState.currentUser?.uid })
    if (nowPlaying !== alreadyPlaying) {
      setAlreadyPlaying(nowPlaying)
    }
  }, [gameState.profiles, authState.currentUser?.uid, alreadyPlaying])
  const currentPlaying = useCurrentPlaying()
  if (
    gameState.phase == null ||
    authState.currentUser?.uid == null ||
    functionsState.functions == null ||
    gameState.timeline == null ||
    gameState.final == null
  ) return <></>

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
  console.log('currentPlaying', currentPlaying)
  const notCurrentPlaying = !currentPlaying
  const joining = gameState.phase === 'join'
  const observing = notCurrentPlaying && !joining
  console.log('observing', observing)
  const spacing = observing ? '10px' : '4px'
  console.log('spacing', spacing)
  return (
    <Stack direction='column' flexGrow='1' height='100%' overflow='hidden' spacing={spacing}>
      <Curtain open={observing}>
        <CenterView />
      </Curtain>
      <Curtain open={joining}>
        <Heading size='lg' textAlign='center'>Players</Heading>
      </Curtain>
      <ProfilesView />
      <Curtain open={observing}>
        <GameHistoryView />
      </Curtain>
    </Stack>
  )
}
