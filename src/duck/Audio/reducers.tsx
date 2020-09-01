const path = require('path');
const src = path.resolve(__dirname, 'src');

// types
import { AudioState } from 'duck/Audio/types'

const initialAudioState: AudioState = {
  src: `${src}/assets/korobushka.wav`,
  isMute: true,
  isPlay: false,
}

export const audio = (audioState = initialAudioState, action) => {
  switch (action.type) {
    case 'audioPlay':
      return {
        ...audioState,
        isPlay: true
      }
    case 'audioStop':
      return {
        ...audioState,
        isPlay: false
      }
    case 'toggleAudioMute':
      return {
        ...audioState,
        isMute: !audioState.isMute
      }
    default: return audioState
  }
}
