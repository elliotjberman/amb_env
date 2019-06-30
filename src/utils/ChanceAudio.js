import {Howl} from 'howler';

export default class ChanceAudio {
  constructor(options) {
    this.howls = options.sources.map((source) => {
      return new Howl({src: [source], volume: options.volume, autoplay: false});
    })
    
    this.probability = options.probability || 1;
    this.interval = options.interval || 1000
  }

  activate() {
    this.interval = setInterval(() => { this.play() }, this.interval);
  }

  play() {
    if (Math.random() <= this.probability) {
      let howl = this.selectRandomHowl();
      howl.play();
    }
  }

  selectRandomHowl() {
    return this.howls[Math.floor(Math.random() * this.howls.length)];
  }
}
