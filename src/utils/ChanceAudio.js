import {Howl} from 'howler';

// TODO: Condense all audio down into this
// TODO: Repeats (on / off)

export default class ChanceAudio {
  constructor(options) {
    this.probability = options.probability || 1;
    this.interval = options.interval || 1000;
    this.isSequence = options.isSequence || false;
    this.noRepeats = options.noRepeats || false;
    
    this.howls = options.sources.map((source) => {
      return new Howl({
        src: [source], 
        volume: options.volume
      });
    });

    this.index = 0;
    this.mostRecentHowl = null;
  }

  activate() {
    this.interval = setInterval(() => { this.play() }, this.interval);
  }

  play() {
    if (Math.random() <= this.probability) {
      let howl = this.isSequence ? this.selectHowlAtNextIndex() : this.selectRandomHowl();
      howl.play();
    }
  }

  selectRandomHowl() {
    const filteredHowls = this.howls.filter(howl => howl !== this.mostRecentHowl);
    
    const candidateHowls = this.noRepeats ? filteredHowls : this.howls;
    const chosenHowl = candidateHowls[Math.floor(Math.random() * candidateHowls.length)];

    this.mostRecentHowl = chosenHowl;
    
    return chosenHowl;
  }

  selectHowlAtNextIndex() {
    if (this.index === this.howls.length - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }

    return this.howls[this.index];
  }
}
