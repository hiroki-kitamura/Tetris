import * as React from 'react';
import { render } from 'react-dom';
import { Tetris } from 'pages/Tetris';

const App = () => {
  return <Tetris />
}

render(<App />, document.getElementById('app'));