import * as React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, Store, Action } from 'redux';
import { Provider, connect } from 'react-redux'
import Tetris from 'containers/Tetris';
import { tetris } from 'duck/Tetris/reducers'
import { TetrisState } from 'duck/Tetris/types'

interface StoreState {
  tetris: TetrisState
}

const rootReducer = combineReducers({ tetris })

const store: Store<StoreState, Action> = createStore(rootReducer)


const App = () => {
  return (
    <Provider store={store}>
      <Tetris />
    </Provider >
  )
}

render(<App />, document.getElementById('app'));