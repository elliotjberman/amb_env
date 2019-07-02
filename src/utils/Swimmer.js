import {Howl} from 'howler';

export default class Swimmer {
  constructor(obj) {

    this.baseInterval = obj.parameters.interval;
    this.interval = this.baseInterval;

    this.baseProbability = obj.parameters.probability || 1;
    this.probability = this.baseProbability;

    this.baseVolume = obj.parameters.volume || 1;
    this.volume = this.baseVolume;

    this.baseStereo = obj.parameters.stereo || 0;
    this.stereo = this.baseStereo;
    
    this.howls = obj.parameters.sources.map((source) => {
      return new Howl({
        src: [source],
        volume: this.baseVolume,
        stereo: this.baseStereo
      });
    });

    this.isSequence = obj.parameters.isSequence || false;
    this.noRepeats = obj.parameters.noRepeats || false;
    this.overlapAmount = obj.parameters.overlapAmount || 0;
    
    this.index = 0;
    this.lastIndex = 0;

    this.lfos = obj.lfos;
    
    this.findLfo = (param) => {
      for (let i = 0; i < this.lfos.length; i++) {
        if (this.lfos[i].name === obj.modMatrix[param].lfo) {
          return this.lfos[i];
        }
      }
    }

    this.volumeModAmount = obj.modMatrix.volumeMod.amount || 0;
    this.volumeModLfo = this.findLfo('volumeMod');

    this.intervalModAmount = obj.modMatrix.intervalMod.amount || 0;
    this.intervalModLfo = this.findLfo('intervalMod');

    this.probabilityModAmount = obj.modMatrix.probabilityMod.amount || 0;
    this.probabilityModLfo = this.findLfo('probabilityMod');

    this.stereoModAmount = obj.modMatrix.stereoMod.amount || 0;
    this.stereoModLfo = this.findLfo('stereoMod');
    
    this.phaseFlip = obj.modMatrix ? obj.modMatrix.phaseFlip : false;

    this.isLooper = !this.baseInterval;
  }

  activate() {
    for (let i = 0; i < this.lfos.length; i++) {
      this.lfos[i].startTime = Date.now();
    }

    if (!this.baseInterval) this.calcInterval();
    this.queueAudio(this.baseInterval); // solidify the difference between baseInterval and interval
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
  
    const modifyParam = (baseParam, modFactor, lfo, stereoHack) => {
      let voltage =  this.phaseFlip ? 1 - lfo.getVoltage() : lfo.getVoltage();
      if (lfo) {
        let scaledParam = stereoHack ? baseParam * (voltage * 2 - 1) : baseParam * voltage;
        return modFactor * scaledParam + (1 - modFactor) * baseParam;
      }
    }

    if (this.isLooper) { // SKETCH ?
      setInterval(() => { 
      this.howls.forEach(howl => howl.volume(modifyParam(this.volume, this.volumeModAmount, this.volumeModLfo)));
    }, 10);
    } else {
      this.howls.forEach(howl => howl.volume(modifyParam(this.volume, this.volumeModAmount, this.volumeModLfo)));
    }

    this.interval = modifyParam(this.baseInterval, this.intervalModAmount, this.intervalModLfo); 
    this.probability = modifyParam(this.baseProbability, this.probabilityModAmount, this.probabilityModLfo);
    
    // setInterval(() => { 
    //   this.howls.forEach(howl => howl.stereo(modifyParam(this.baseStereo, this.stereoModAmount, this.stereoModLfo, true)));
    // }, 5);

  }

  playSound() {
    this.lfoHandler();

    console.log('playing sound...');

    this.lastIndex = this.index; // needed to move up here

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
