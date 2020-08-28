import * as React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux'
import Tetris from 'containers/Tetris';
import { tetris } from 'duck/Tetris/reducers'
interface Store {
  tetris: any
}
const rootReducer = combineReducers({ tetris })

const store = createStore(rootReducer)

const App = () => {
  return (
    <Provider store={store}>
      <Tetris />
    </Provider >
  )
}

render(<App />, document.getElementById('app'));