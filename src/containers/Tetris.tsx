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
// types 
import { Cells, Block, TetrisState, TetrisProps } from 'duck/Tetris/types'
// functions
import { isGameOver, shouldFixActiveBlock } from 'duck/Tetris/common/common'

const TetrisView = styled.div`
  display: flex;
`

const Tetris = (props: TetrisProps) => {

  const dropActiveBlockIfCanDrop = () => {
    if (isGameOver(props.state.fixedCells)) {
      props.gameOver()
    } else if (shouldFixActiveBlock(props.state.activeBlock, props.state.fixedCells)) {
      props.fixActiveBlock()
    } else {
      props.dropActiveBlock()
    }
  }

  const windowKeyDownEvent = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'h':
        props.shiftActiveBlockLeft()
        break;
      case 'ArrowRight':
      case 'l':
        props.shiftActiveBlockRight()
        break;
      case 'ArrowDown':
      case 'j':
        dropActiveBlockIfCanDrop()
        break;
      case ' ':
        props.spinActiveBlock()
    }
  }
  useEffect(() => {
    if (!props.state.activeBlock) return
    const dropTimeoutId = setTimeout(() => {
      dropActiveBlockIfCanDrop()
    }, props.state.dropSpeed)

    window.addEventListener('keydown', windowKeyDownEvent)

    const acceleTimeoutId = setTimeout(() => {
      props.acceleDropSpeed()
    }, 3000);

    return () => {
      clearTimeout(dropTimeoutId)
      clearInterval(acceleTimeoutId)
      window.removeEventListener('keydown', windowKeyDownEvent)
    }
  }, [props.state.activeBlock])

  useEffect(() => {
    if (props.state.audio.isPlay) props.audioPlay()
    else props.audioStop()
  }, [props.state.isPlay])

  return (
    <TetrisView>
      <Screen
        viewCells={props.state.viewCells}
        nextBlock={props.state.nextBlock}
        isGameOver={props.state.isGameOver}
        score={props.state.score} />
      <Controller
        clickEvent={{
          moveLeft: props.putActiveBlock,
          moveRight: props.shiftActiveBlockRight,
          moveBottom: props.dropActiveBlock,
          startGame: props.putActiveBlock,
          resetGame: props.resetGame,
          toggleAudioMute: props.toggleAudioMute,
          spin: props.spinActiveBlock
        }}
        isPlay={props.state.isPlay}
        isGameOver={props.state.isGameOver}
        isMute={props.state.audio.isMute} />
      <Audio
        src={props.state.audio.src}
        isMute={props.state.audio.isMute}
        isPlay={props.state.audio.isPlay} />
    </TetrisView>
  )
}

interface TetrisStateMap {
  state: TetrisState
}

const mapStateToProps = (state): TetrisStateMap => {
  return {
    state: state.tetris
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    ...tetrisActions
  }, dispatch)
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tetris)