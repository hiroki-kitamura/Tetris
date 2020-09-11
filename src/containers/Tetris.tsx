// node_modules
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components';
// componets
import { Screen } from 'components/Screen'
import { Controller } from 'components/Controller'
import { functionalAudio as Audio } from 'components/Audio'
// actions 
import { shiftActiveBlock, fixActiveBlock, gameOver, spinActiveBlock, removeFullRow, setScore, startGame, resetGame, setDropSpeed } from 'duck/Tetris/actions'
import { audioPlay, audioStop, toggleAudioMute } from 'duck/Audio/actions'
// types 
import { TetrisState } from 'duck/Tetris/types'
import { AudioState } from 'duck/Audio/types'
// functions
import { isGameOver, isFixActiveBlock, existFullRow, getFullRowList, scoreCalculater } from 'duck/Tetris/common/common'

const TetrisView = styled.div`
  display: flex;
`

interface MapTetrisState {
  tetris: TetrisState
  audio: AudioState
}

declare module 'react-redux' {
  function useSelector<T>(Function): T
}

export const Tetris = () => {
  const state = useSelector<MapTetrisState>(state => state)
  const dispatch = useDispatch()

  const windowKeyDownEvent = (e) => {
    console.log(e)
    switch (e.key) {
      case 'ArrowLeft':
      case 'h':
        dispatch(shiftActiveBlock(-1, 0))
        break;
      case 'ArrowRight':
      case 'l':
        dispatch(shiftActiveBlock(1, 0))
        break;
      case 'ArrowDown':
      case 'j':
        dropActiveBlockIfCanDrop()
        break;
      case ' ':
        dispatch(spinActiveBlock())
    }
  }

  const dropActiveBlockIfCanDrop = () => {
    if (isGameOver(state.tetris.fixedCells)) {
      dispatch(gameOver())
    } else if (isFixActiveBlock(state.tetris.activeBlock, state.tetris.fixedCells)) {
      dispatch(fixActiveBlock())
    } else {
      dispatch(shiftActiveBlock(0, 1))
    }
  }

  useEffect(() => {
    if (existFullRow(state.tetris.fixedCells)) {
      const FullRowNum = getFullRowList(state.tetris.fixedCells).length
      dispatch(setScore(state.tetris.score + scoreCalculater(FullRowNum)))
      dispatch(removeFullRow())
    }
  }, [state.tetris.fixedCells, state.tetris.score])

  useEffect(() => {
    if (!state.tetris.isPlay) return
    const dropTimeoutId = setTimeout(() => {
      dropActiveBlockIfCanDrop()
    }, state.tetris.dropSpeed)

    window.addEventListener('keydown', windowKeyDownEvent)

    return () => {
      clearTimeout(dropTimeoutId)
      window.removeEventListener('keydown', windowKeyDownEvent)
    }
  }, [state.tetris.activeBlock, state.tetris.isPlay, state.tetris.dropSpeed])

  useEffect(() => {
    if (!state.tetris.isPlay) return;
    const acceleTimeoutId = setTimeout(() => {
      dispatch(setDropSpeed(state.tetris.dropSpeed * 0.98))
    }, 3000);

    return () => clearInterval(acceleTimeoutId)
  }, [state.tetris.dropSpeed, state.tetris.isPlay])

  useEffect(() => {
    if (state.tetris.isPlay) dispatch(audioPlay())
    else dispatch(audioStop())
  }, [state.tetris.isPlay])

  return (
    <TetrisView>
      <Screen
        activeBlockCells={state.tetris.activeBlock.cells}
        fixedCells={state.tetris.fixedCells}
        nextBlock={state.tetris.nextBlock}
        isGameOver={state.tetris.isGameOver}
        score={state.tetris.score} />
      <Controller
        clickEvent={{
          moveLeft: () => dispatch(shiftActiveBlock(-1, 0)),
          moveRight: () => dispatch(shiftActiveBlock(1, 0)),
          moveBottom: () => dispatch(dropActiveBlockIfCanDrop),
          startGame: () => dispatch(startGame()),
          resetGame: () => dispatch(resetGame()),
          toggleAudioMute: () => dispatch(toggleAudioMute()),
          spin: () => dispatch(spinActiveBlock())
        }}
        isPlay={state.tetris.isPlay}
        isGameOver={state.tetris.isGameOver}
        isMute={state.audio.isMute} />
      <Audio
        src={state.audio.src}
        isMute={state.audio.isMute}
        isPlay={state.audio.isPlay} />
    </TetrisView>
  )
}
