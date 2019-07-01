import {Howl} from 'howler';

// TODO: lfo points in, for a tighter clock, make method on audio object class, apply lfo value, and it knows what value to route it to
// takes in lfo value, and knows what to do with that

export default class ChanceAudio {
  constructor(options) {
    this.volume = options.volume;
    
    this.howls = options.sources.map((source) => {
      return new Howl({
        src: [source],
        volume: this.volume
      });
    });

    this.probability = options.probability || 1;
    this.interval = options.interval || 1000;

    this.isSequence = options.isSequence || false;
    this.noRepeats = options.noRepeats || false;
    this.noOverlapping = options.noOverlapping || false;
    this.phaseFlip = options.phaseFlip || false;

    this.index = 0;
    this.lastIndex = 0;

    this.lfo = options.lfo;
    
    this.volumeMod = options.volumeMod || 0;
  }

  activate() {
    this.queueAudio(this.interval);
  }

  queueAudio(interval) {
    setTimeout(() => { 
      this.play();
      this.queueAudio(this.interval);
    }, interval);
  }

  lfoHandler() {
    let voltage =  this.phaseFlip ? 1 - this.lfo.getVoltage() : this.lfo.getVoltage();

    let scaledVolume = this.volume * voltage;
    let newVolume = this.volumeMod * scaledVolume + (1 - this.volumeMod) * this.volume;
    
    this.howls.forEach(howl => howl.volume(newVolume));
    
    // let newInterval = voltage * 1000;
    // this.interval = newInterval > 40 ? newInterval : 40; // min voltage obj in the json?

    // this.probability = voltage;
  }

  play() {
    this.lfoHandler();

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
