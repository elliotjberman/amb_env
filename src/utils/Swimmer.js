import {Howl} from 'howler';

export default class Swimmer {
  constructor(obj) {

    this.baseInterval = obj.parameters.interval;
    this.interval = this.baseInterval;

    this.baseProbability = obj.parameters.probability || 1;
    this.probability = this.baseProbability;

    this.baseVolume = obj.parameters.volume;
    this.volume = this.baseVolume;
    
    this.howls = obj.parameters.sources.map((source) => {
      return new Howl({
        src: [source],
        volume: this.baseVolume
      });
    });

    this.isSequence = obj.parameters.isSequence || false;
    this.noRepeats = obj.parameters.noRepeats || false;
    this.overlapAmount = obj.parameters.overlapAmount || 0;
    
    this.index = 0;
    this.lastIndex = 0;

    this.lfo = obj.lfo;
    
    this.volumeMod = obj.modMatrix ? obj.modMatrix.paramMods.volumeMod : 0;
    this.intervalMod = obj.modMatrix ? obj.modMatrix.paramMods.intervalMod : 0;
    this.probabilityMod = obj.modMatrix ? obj.modMatrix.paramMods.probabilityMod : 0;
    this.phaseFlip = obj.modMatrix ? obj.modMatrix.phaseFlip : false;
  }

  activate() {
    this.queueAudio(this.baseInterval); // solidify the difference between baseInterval and interval
    if (!this.baseInterval) this.calcInterval();
  }

  calcInterval() {
    this.baseInterval = (this.howls[0].duration() * 1000) - this.overlapAmount; // make this take in the overall length and calc an overlap percentage
  }

  queueAudio(interval) {
    setTimeout(() => { 
      this.playSound();
      this.queueAudio(this.interval);
    }, interval);
  }

  lfoHandler() {
    let voltage =  this.phaseFlip ? 1 - this.lfo.getVoltage() : this.lfo.getVoltage();
    
    const modifyParam = (baseParam, modFactor) => {
      if (this.lfo) {
        let scaledParam = baseParam * voltage;
        return modFactor * scaledParam + (1 - modFactor) * baseParam;
      }
    }

    this.howls.forEach(howl => howl.volume(modifyParam(this.volume, this.volumeMod)));
    this.interval = modifyParam(this.baseInterval, this.intervalMod); 
    this.probability = modifyParam(this.baseProbability, this.probabilityMod);
  }

  playSound() {
    this.lfoHandler();

    this.lastIndex = this.index; // needed to move up here

    console.log(this.probability);

    if (Math.random() <= this.probability) {  
      this.goToNextIndex(); // this messes with the sequence tho
      this.howls[this.index].play();
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
    
    if (this.isSequence) {
      this.incrementIndex();
      return;
    }
    this.goToRandomIndex();
  }
}
