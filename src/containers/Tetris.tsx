import * as React from 'react';
import { useEffect, useReducer } from 'react';
import { TetrisView } from '../components/TetrisView';
import { getAddedPos, getPosNumber, shiftBlockPos } from 'functions/PositionShifter'
import { Provider, connect } from 'react-redux'
import { Cells, Cell, Block } from 'duck/Tetris/types'
import { tetrisActions } from 'duck/Tetris/actions'
import { bindActionCreators } from 'redux';
const path = require('path');
const src = path.resolve(__dirname, 'src');



const colNumber: number = 10;
const rowNumber: number = 20;
const audio = new Audio(`${src}/assets/korobushka.wav`)

const Tetris = (props) => {
  const shouldFixActiveBlock = (activeBlock: Block, fixedCells: Cells): boolean => {
    for (let XY in activeBlock.cells) {

      let [X, Y] = getPosNumber(XY)

      // 一番下に落ちた時
      if (Y === rowNumber - 1) return true
      // 下にブロックがある時
      if (!activeBlock.cells.hasOwnProperty(`${X},${Y + 1}`) && fixedCells[`${X},${Y + 1}`].exist === true)
        return true;
    }
    return false
  }

  const isGameOver = (fixedCells: Cells): boolean => {
    for (let XY in fixedCells) {
      let [X, Y] = getPosNumber(XY)

      if (fixedCells[`${X},1`].exist === true) return true
    }
    return false
  }

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
    var timeoutId = setTimeout(() => {
      dropActiveBlockIfCanDrop()
    }, props.state.dropSpeed)

    window.addEventListener('keydown', windowKeyDownEvent)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('keydown', windowKeyDownEvent)
    }
  }, [props.state.activeBlock])

  useEffect(() => {
    props.toggleAudioPlay(audio)
  }, [props.state.isPlay])

  useEffect(() => {
    setInterval(() => {
      props.acceleDropSpeed()
    }, 3000);
  }, [props.state.ActiveBlock])

  audio.muted = props.state.isMute
  return (
    <TetrisView
      viewCells={props.state.viewCells}
      score={props.score}
      nextBlock={{
        name: props.state.nextBlock.name,
        cells: props.state.nextBlock.cells
      }}
      isGameOver={props.state.isGameOver}
      isPlay={props.state.isPlay}
      isMute={props.state.isMute}
      clickEvent={{
        moveLeft: () => props.shiftActiveBlockLeft(),
        moveRight: () => props.shiftActiveBlockRight(),
        moveBottom: () => dropActiveBlockIfCanDrop(),
        startGame: () => props.putActiveBlock(),
        resetGame: () => props.resetGame(),
        toggleAudioMute: () => props.toggleAudioMute(audio),
        spin: () => props.spinActiveBlock(),
      }}
    />
  )
}
const mapStateToProps = (state) => {
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