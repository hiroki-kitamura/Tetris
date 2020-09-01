// node_modules
import * as React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
// componets
import { Screen } from 'components/Screen'
import { Controller } from 'components/Controller'
import { functionalAudio as Audio } from 'components/Audio'
// actions 
import { tetrisActions } from 'duck/Tetris/actions'
import { audioActions } from 'duck/Audio/actions'
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
  tetris: TetrisActions & {
    state: TetrisState
  }
  audio: AudioActions & {
    state: AudioState
  }
}

const Tetris = (props: TetrisProps) => {

  const dropActiveBlockIfCanDrop = () => {
    if (isGameOver(props.tetris.state.fixedCells)) {
      props.tetris.gameOver()
    } else if (shouldFixActiveBlock(props.tetris.state.activeBlock, props.tetris.state.fixedCells)) {
      props.tetris.fixActiveBlock()
    } else {
      props.tetris.dropActiveBlock()
    }
  }

  const windowKeyDownEvent = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'h':
        props.tetris.shiftActiveBlockLeft()
        break;
      case 'ArrowRight':
      case 'l':
        props.tetris.shiftActiveBlockRight()
        break;
      case 'ArrowDown':
      case 'j':
        dropActiveBlockIfCanDrop()
        break;
      case ' ':
        props.tetris.spinActiveBlock()
    }
  }
  useEffect(() => {
    if (!props.tetris.state.activeBlock) return
    const dropTimeoutId = setTimeout(() => {
      dropActiveBlockIfCanDrop()
    }, props.tetris.state.dropSpeed)

    window.addEventListener('keydown', windowKeyDownEvent)

    const acceleTimeoutId = setTimeout(() => {
      props.tetris.acceleDropSpeed()
    }, 3000);

    return () => {
      clearTimeout(dropTimeoutId)
      clearInterval(acceleTimeoutId)
      window.removeEventListener('keydown', windowKeyDownEvent)
    }
  }, [props.tetris.state.activeBlock])

  useEffect(() => {
    if (props.tetris.state.isPlay) props.audio.audioPlay()
    else props.audio.audioStop()
  }, [props.tetris.state.isPlay])

  return (
    <TetrisView>
      <Screen
        viewCells={props.tetris.state.viewCells}
        nextBlock={props.tetris.state.nextBlock}
        isGameOver={props.tetris.state.isGameOver}
        score={props.tetris.state.score} />
      <Controller
        clickEvent={{
          moveLeft: props.tetris.putActiveBlock,
          moveRight: props.tetris.shiftActiveBlockRight,
          moveBottom: props.tetris.dropActiveBlock,
          startGame: props.tetris.putActiveBlock,
          resetGame: props.tetris.resetGame,
          toggleAudioMute: props.audio.toggleAudioMute,
          spin: props.tetris.spinActiveBlock
        }}
        isPlay={props.tetris.state.isPlay}
        isGameOver={props.tetris.state.isGameOver}
        isMute={props.audio.state.isMute} />
      <Audio
        src={props.audio.state.src}
        isMute={props.audio.state.isMute}
        isPlay={props.audio.state.isPlay} />
    </TetrisView>
  )
}



const mapStateToProps = (state): MapTetrisState => ({
  tetris: state.tetris,
  audio: state.audio
})


const mapDispatchToProps = (dispatch): MapTetrisActions => ({
  tetris: bindActionCreators({
    ...tetrisActions
  }, dispatch),
  audio: bindActionCreators({
    ...audioActions
  }, dispatch)
})

const mergeProps = (stateProps: MapTetrisState, dispatchProps: MapTetrisActions): TetrisProps => ({
  tetris: {
    ...dispatchProps.tetris,
    state: stateProps.tetris
  },
  audio: {
    ...dispatchProps.audio,
    state: stateProps.audio
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Tetris)