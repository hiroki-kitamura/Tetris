
export const audioPlay = () => ({
  type: "audioPlay",
})
export const audioStop = () => ({
  type: "audioStop",
})
export const toggleAudioMute = () => ({
  type: "toggleAudioMute"
})

export const audioActions = {
  audioPlay,
  audioStop,
  toggleAudioMute
}