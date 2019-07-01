import {Howl} from 'howler';

export default class AudioObject {
  constructor(options) {
    const howlerProps = {
      src: [options.source],
      volume: options.volume || 1,
      loop: true
    }
    this.audio = new Howl(howlerProps);
  }

  activate() {
    this.audio.play();
  }
}
