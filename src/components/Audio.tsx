import * as React from 'react';
import { useEffect } from 'react';

interface AudioProps {
  src: string,
  isMute: boolean,
  isPlay: boolean
}

let audio

export const functionalAudio = (props: AudioProps) => {
  useEffect(() => {
    audio = new Audio(props.src);
  }, [props.src])

  useEffect(() => {
    audio.muted = props.isMute
  }, [props.isMute])

  useEffect(() => {
    if (props.isPlay) {
      audio.play()
      audio.loop = true;
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [props.isPlay])

  return <></>
}