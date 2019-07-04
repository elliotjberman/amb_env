import {Howl} from 'howler';

export default class Swimmer {
  constructor(obj) {

    this.interval = obj.parameters.interval;

    this.baseProbability = obj.parameters.probability || 1;
    this.probability = this.baseProbability;

    this.volume = obj.parameters.volume;

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
    this.noWavOverlapping = obj.parameters.noWavOverlapping || false;

    this.isLooper = obj.parameters.isLooper || false;
    this.overlapAmount = obj.parameters.overlapAmount || 0;
    this.playOnStart = obj.parameters.playOnStart || false;
    
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

    if (obj.modMatrix.onGate) {
      this.onGateLfo = this.findLfo('onGate');
      this.onGatePhaseFlip = obj.modMatrix.onGate.phaseFlip || false;
      this.onGateToggled = obj.modMatrix.onGate.toggled || false;
    }
    
    this.phaseFlip = obj.modMatrix ? obj.modMatrix.phaseFlip : false;

    this.index = 0;
    this.lastIndex = 0;
  }

  activate() {
    for (let i = 0; i < this.lfos.length; i++) {
      this.lfos[i].startTime = Date.now();
    }

    if (this.isLooper) this.calcInterval();
    this.queueAudio(this.interval); 
  }

  calcInterval() {
    this.interval = (this.howls[0].duration() * 1000) + this.overlapAmount; // sketchy how howls[0] duration harcoded
  }

  queueAudio(interval) {
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
  
    if (this.onGateLfo) this.isOn = this.onGatePhaseFlip ? 1 - this.onGateLfo.getVoltage() : this.onGateLfo.getVoltage();
  }

  playSound() {
    this.lfoHandler();

    this.lastIndex = this.index;

    const goodToGo = this.noWavOverlapping ? !this.howls[this.lastIndex].playing() : true;

    console.log('clock');

    const onGate = this.onGateToggled ? this.probability * this.isOn : this.probability;

    if (Math.random() <= onGate && goodToGo) {
      if (this.isSequence) {
        this.howls[this.index].play();
        this.goToNextIndex();  
      } else {
        this.goToNextIndex(); 
        this.howls[this.index].play();
      }
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
