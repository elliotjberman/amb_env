import {Howl} from 'howler';

export default class AudioObject {
  constructor(options) {
    const howlerProps = {
      src: [options.source],
      volume: options.volume || 1,
      loop: options.loop
    }
    this.audio = new Howl(howlerProps);
    this.probability = options.probability || 1;

    if (!options.loop) {
      this.interval = setInterval(() => { this.activate() }, options.interval || 1000);
    }
  }

  activate() {
    if (Math.random() <= this.probability) {
      this.audio.play();
    }
  }
}
