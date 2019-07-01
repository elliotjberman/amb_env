import {Howl} from 'howler';

export default class Swimmer {
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
    

    this.index = 0;
    this.lastIndex = 0;

    this.isLooper = obj.parameters.isLooper;

    this.lfo = obj.lfo;
    
    this.volumeMod = obj.modMatrix ? obj.modMatrix.paramMods.volumeMod : 0;
    this.intervalMod = obj.modMatrix ? obj.modMatrix.paramMods.intervalMod : 0;
    this.probabilityMod = obj.modMatrix ? obj.modMatrix.paramMods.probabilityMod : 0;
    this.phaseFlip = obj.modMatrix ? obj.modMatrix.phaseFlip : false;
    
  }

  activate() {
    this.queueAudio(this.baseInterval); // solidify the difference between baseInterval and interval
    if (this.isLooper) this.calcLooper();
  }

  calcLooper() {
    this.baseInterval = (this.howls[0].duration() * 1000) - 500;
  }

  queueAudio(interval) {
    setTimeout(() => { 
      this.play();
      this.queueAudio(this.interval);
    }, interval);
  }

  lfoHandler() {
    const modifyParam = (baseParam, modFactor) => {
      if (this.lfo) {
        let voltage =  this.phaseFlip ? 1 - this.lfo.getVoltage() : this.lfo.getVoltage();

        let scaledParam = baseParam * voltage;
        return modFactor * scaledParam + (1 - modFactor) * baseParam;
      }
    }

    this.howls.forEach(howl => howl.volume(modifyParam(this.volume, this.volumeMod)));
    
    // if (this.isLooper) setInterval(() => { // SKETCH ?
    //   this.howls.forEach(howl => howl.volume(modifyParam(this.volume, this.volumeMod)));
    // }, 10);
    
    this.interval = modifyParam(this.baseInterval, this.intervalMod); 
    this.probability = modifyParam(this.baseProbability, this.probabilityMod);

    console.log(this.probability);
  }

  play() {
    this.lfoHandler();

    this.lastIndex = this.index; // needed to move up here

    const goodToGo = this.noOverlapping ? !this.howls[this.lastIndex].playing() : true;

    if (Math.random() <= this.probability && goodToGo) {
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
