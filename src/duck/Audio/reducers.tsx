const path = require('path');
const src = path.resolve(__dirname, 'src');
// actions
import { ActionTypes } from 'duck/Audio/actions'
// types
import { AudioState } from 'duck/Audio/types'

const initialAudioState: AudioState = {
  src: `${src}/assets/korobushka.wav`,
  isMute: true,
  isPlay: false,
}

export const audio = (audioState = initialAudioState, action) => {
  switch (action.type) {
    case ActionTypes.audioPlay:
      return {
        ...audioState,
        isPlay: true
      }
    case ActionTypes.audioStop:
      return {
        ...audioState,
        isPlay: false
      }
    case ActionTypes.toggleAudioMute:
      return {
        ...audioState,
        isMute: !audioState.isMute
      }
    default: return audioState
  }
}
