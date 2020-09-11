export enum ActionTypes {
  audioPlay = "audioPlay",
  audioStop = "audioStop",
  toggleAudioMute = "toggleAudioMute"
}

export const audioPlay = () => ({
  type: ActionTypes.audioPlay,
})
export const audioStop = () => ({
  type: ActionTypes.audioStop,
})
export const toggleAudioMute = () => ({
  type: ActionTypes.toggleAudioMute
})
