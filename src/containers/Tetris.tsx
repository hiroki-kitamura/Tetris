// node_modules
import * as React from 'react';
import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect, useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components';
// componets
import { Screen } from 'components/Screen'
import { Controller } from 'components/Controller'
import { functionalAudio as Audio } from 'components/Audio'
// actions 
import { putActiveBlock, shiftActiveBlockLeft, shiftActiveBlockRight, dropActiveBlock, fixActiveBlock, gameOver, spinActiveBlock, resetGame, acceleDropSpeed } from 'duck/Tetris/actions'
import { audioPlay, audioStop, toggleAudioMute } from 'duck/Audio/actions'
// types 
import { TetrisState, TetrisActions } from 'duck/Tetris/types'
import { AudioState, AudioActions } from 'duck/Audio/types'
// functions
import { isGameOver, shouldFixActiveBlock } from 'duck/Tetris/common/common'

const TetrisView = styled.div`
  display: flex;
`

interface MapTetrisState {
  tetris: TetrisState
  audio: AudioState
}

interface MapTetrisActions {
  tetris: TetrisActions,
  audio: AudioActions
}

interface TetrisProps {
  tetris: {
    tetris: TetrisActions & {
      state: TetrisState
    }
    audio: AudioActions & {
      state: AudioState
    }
  }
}

declare module 'react-redux' {
  function useSelector(Function): MapTetrisState
}

export const Tetris = () => {
  const state = useSelector(state => state.tetrisReducer)
  const dispatch = useDispatch()

  const dropActiveBlockIfCanDrop = () => {
    if (isGameOver(state.tetris.fixedCells)) {
      dispatch(gameOver())
    } else if (shouldFixActiveBlock(state.tetris.activeBlock, state.tetris.fixedCells)) {
      dispatch(fixActiveBlock())
    } else {
      dispatch(dropActiveBlock())
    }
  }

  const windowKeyDownEvent = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'h':
        dispatch(shiftActiveBlockLeft())
        break;
      case 'ArrowRight':
      case 'l':
        dispatch(shiftActiveBlockRight())
        break;
      case 'ArrowDown':
      case 'j':
        dropActiveBlockIfCanDrop()
        break;
      case ' ':
        dispatch(spinActiveBlock())
    }
  }
  useEffect(() => {
    if (!state.tetris.activeBlock) return
    const dropTimeoutId = setTimeout(() => {
      dropActiveBlockIfCanDrop()
    }, state.tetris.dropSpeed)

    window.addEventListener('keydown', windowKeyDownEvent)

    const acceleTimeoutId = setTimeout(() => {
      dispatch(acceleDropSpeed())
    }, 3000);

    return () => {
      clearTimeout(dropTimeoutId)
      clearInterval(acceleTimeoutId)
      window.removeEventListener('keydown', windowKeyDownEvent)
    }
  }, [state.tetris.activeBlock])

  useEffect(() => {
    if (state.tetris.isPlay) dispatch(audioPlay())
    else dispatch(audioStop())
  }, [state.tetris.isPlay])

  return (
    <TetrisView>
      <Screen
        viewCells={state.tetris.viewCells}
        nextBlock={state.tetris.nextBlock}
        isGameOver={state.tetris.isGameOver}
        score={state.tetris.score} />
      <Controller
        clickEvent={{
          moveLeft: () => dispatch(putActiveBlock()),
          moveRight: () => dispatch(shiftActiveBlockRight()),
          moveBottom: () => dispatch(dropActiveBlock()),
          startGame: () => dispatch(putActiveBlock()),
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
