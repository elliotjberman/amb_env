import {Howl} from 'howler';

// TODO: Condense all audio down into this
// TODO: Repeats (on / off)

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
    this.allowWavOverlap = !options.allowWavOverlap || false;

    this.index = 0;
    this.mostRecentHowl = null;
  }

  activate() {
    if (this.allowWavOverlap) this.interval += this.getMaxDuration() * 1000;
    
    setInterval(() => { this.play() }, this.interval);
  }

  getMaxDuration() { // is this sketch
    const durations = this.howls.map((howl) => {
      return howl.duration();
    });

    return Math.max(...durations);
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
