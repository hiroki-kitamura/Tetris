// node_modules
import * as React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, Store, Action } from 'redux';
import { Provider } from 'react-redux'
// container
import { Tetris } from 'containers/Tetris';
// reducer
import { tetris } from 'duck/Tetris/reducers'
import { audio } from 'duck/Audio/reducers'
// types
import { TetrisState } from 'duck/Tetris/types'
import { AudioState } from 'duck/Audio/types'

interface StoreState {
  tetrisReducer: {
    tetris: TetrisState
    audio: AudioState
  }
}
const tetrisReducer = combineReducers({ tetris, audio })
const rootReducer = combineReducers({ tetrisReducer })

const store: Store<StoreState, Action> = createStore(rootReducer)

const App = () => {
  return (
    <Provider store={store}>
      <Tetris />
    </Provider >
  )
}

render(<App />, document.getElementById('app'));