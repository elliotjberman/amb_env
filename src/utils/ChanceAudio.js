import {Howl} from 'howler';

export default class ChanceAudio {
  constructor(obj) {
    this.volume = obj.parameters.volume;
    
    this.howls = obj.parameters.sources.map((source) => {
      return new Howl({
        src: [source],
        volume: this.volume
      });
    });

    this.baseInterval = obj.parameters.interval || 1000;
    this.baseProbability = obj.parameters.probability || 1;
    
    this.isSequence = obj.parameters.isSequence || false;
    this.noRepeats = obj.parameters.noRepeats || false;
    this.noOverlapping = obj.parameters.noOverlapping || false; 
    this.phaseFlip = obj.parameters.phaseFlip || false;

    this.index = 0;
    this.lastIndex = 0;

    this.lfo = obj.lfo;
    
    this.volumeMod = obj.modMatrix.volumeMod || 0;
    this.intervalMod = obj.modMatrix.intervalMod || 0;
    this.probabilityMod = obj.modMatrix.probabilityMod || 0;
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
    const modifyParam = (baseParam, modFactor) => {
      let voltage =  this.phaseFlip ? 1 - this.lfo.getVoltage() : this.lfo.getVoltage();

      let scaledParam = baseParam * voltage;
      return modFactor * scaledParam + (1 - modFactor) * baseParam;
    }

    this.howls.forEach(howl => howl.volume(modifyParam(this.volume, this.volumeMod)));
    this.interval = modifyParam(this.baseInterval, this.intervalMod); 
    this.probability = modifyParam(this.baseProbability, this.probabilityMod);
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
