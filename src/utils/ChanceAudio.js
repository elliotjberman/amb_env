import {Howl} from 'howler';

// TODO: Condense all audio down into this

export default class ChanceAudio {
  constructor(options) {
    this.howls = options.sources.map((source) => {
      return new Howl({
        src: [source], 
        volume: options.volume
      });
    });

    this.probability = options.probability || 1;
    this.interval = options.interval || 1000;
  
    this.isSequence = options.isSequence || false;
    this.noRepeats = options.noRepeats || false;
    this.noOverlapping = options.noOverlapping || false;

    this.index = 0;
    this.lastIndex = 0;
  }

  activate() {
    setInterval(() => { this.play() }, this.interval);
  }

  getMaxDuration() { // is this sketch
    const durations = this.howls.map((howl) => {
      return howl.duration();
    });

    return Math.max(...durations);
  }

  play() {
    const goodToGo = this.noOverlapping ? !this.howls[this.lastIndex].playing() : true;
    if (Math.random() <= this.probability && goodToGo) {
      this.howls[this.index].play();
      this.goToNextIndex();
    }
  }

  goToRandomIndex() {
    let randomIndex = Math.floor(Math.random() * this.howls.length);
    while(this.noRepeats && this.index === randomIndex) {
      randomIndex = Math.floor(Math.random() * this.howls.length);
    }
    this.index = randomIndex;
  }

  incrementIndex() {
    if (this.index === this.howls.length - 1) {
      this.index = 0;
      return;
    }
    this.index += 1;
  }

  goToNextIndex() {
    this.lastIndex = this.index;
    if (this.isSequence) {
      this.incrementIndex();
      return;
    }
    this.goToRandomIndex();
  }
}
