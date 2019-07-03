import {Howl} from 'howler';

export default class Swimmer {
  constructor(obj) {

    this.interval = obj.parameters.interval;

    this.baseProbability = obj.parameters.probability || 1;
    this.probability = this.baseProbability;

    this.volume = obj.parameters.volume || 1;

    this.stereo= obj.parameters.stereo || 0;
    
    this.howls = obj.parameters.sources.map((source) => {
      return new Howl({
        src: [source],
        volume: this.volume,
        stereo: this.stereo
      });
    });

    this.isSequence = obj.parameters.isSequence || false;
    this.noRepeats = obj.parameters.noRepeats || false;
    this.overlapAmount = obj.parameters.overlapAmount || 0;
    this.playOnStart = obj.parameters.playOnStart || false;

    this.isLooper = !this.interval;
    
    this.lfos = obj.lfos;
    
    this.findLfo = (param) => {
      for (let i = 0; i < this.lfos.length; i++) {
        if (this.lfos[i].name === obj.modMatrix[param].lfo) {
          return this.lfos[i];
        }
      }
    }

    this.volumeModLfo = this.findLfo('volumeMod');
    this.volumeModPhaseFlip = obj.modMatrix.volumeMod.phaseFlip || false;
    this.volumeModAmount = obj.modMatrix.volumeMod.amount || 0;
    
    this.probabilityModLfo = this.findLfo('probabilityMod');
    this.probabilityModPhaseFlip = obj.modMatrix.probabilityMod.phaseFlip || false;
    this.probabilityModAmount = obj.modMatrix.probabilityMod.amount || 0;
    
    this.phaseFlip = obj.modMatrix ? obj.modMatrix.phaseFlip : false;

    this.index = 0;
    this.lastIndex = 0;
  }

  activate() {
    for (let i = 0; i < this.lfos.length; i++) {
      this.lfos[i].startTime = Date.now();
    }

    if (!this.interval) this.calcInterval() ;
    this.queueAudio(this.interval); 
  }

  calcInterval() {
    this.interval = (this.howls[0].duration() * 1000) - this.overlapAmount; 
  }

  queueAudio(interval) {
    console.log(interval);
    if (this.playOnStart) this.playSound();
    setInterval(() => { 
      this.playSound();
    }, interval);
  }

  lfoHandler() {
    const modifyParam = (baseParam, modFactor, lfo, phaseFlip) => {
      let voltage =  phaseFlip ? 1 - lfo.getVoltage() : lfo.getVoltage();
      if (lfo) {
        let scaledParam = baseParam * voltage;
        return modFactor * scaledParam + (1 - modFactor) * baseParam;
      }
    }

    const sampleRate = 10;

    if (this.isLooper) { // SKETCH ? only use this on "long" swimmers, cutty for now
        console.log('in the danger zone...');
        setInterval(() => { 
        this.howls.forEach(howl => howl.volume(modifyParam(this.volume, this.volumeModAmount, this.volumeModLfo, this.volumeModPhaseFlip)));
      }, sampleRate);
      } else {
        this.howls.forEach(howl => howl.volume(modifyParam(this.volume, this.volumeModAmount, this.volumeModLfo, this.volumeModPhaseFlip)));
    }

    this.probability = modifyParam(this.baseProbability, this.probabilityModAmount, this.probabilityModLfo, this.probabilityModPhaseFlip);
  }

  playSound() {
    this.lfoHandler();

    this.lastIndex = this.index;

    if (Math.random() <= this.probability) {  
      this.goToNextIndex(); 
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
