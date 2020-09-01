export interface AudioState {
  src: string,
  isMute: boolean,
  isPlay: boolean
}

export interface AudioActions {
  audioPlay,
  audioStop,
  toggleAudioMute,
}

export interface AudioProps extends AudioActions {
  state: AudioState
}