export default class LFO {
  constructor(name, rate, shape, dutyCycle) {
    this.name = name;
    this.rate = rate;
    this.shape = shape;

    // some real nice jank here boyz, the "coffin square wav"
    this.on = false; 
    setInterval(() => {this.on  = !this.on}, this.rate);

    // cutty PWM hack
    setInterval(() => {
      if (this.index === this.waveNums.length - 1) {
        this.index = 0;
      } else {
        this.index += 1;
      }
      
    }, this.rate / 20);

    this.dutyCycle = dutyCycle * 2;

    this.remainder = 200 - this.dutyCycle;

    this.waveNums = [];

    for (let i = 0; i < this.dutyCycle / 10; i++) {
      this.waveNums.push(1)
    }

    for (let i = 0; i < this.remainder / 10; i++) {
      this.waveNums.push(0);
    }

    this.waveNums.sort();

    console.log(this.waveNums);

    this.index = 0;
  }

  getVoltage() {
    let secondsElapsed = (Date.now() - this.startTime) / 1000;
    let wave = -0.5 * (Math.cos(secondsElapsed * this.rate * 2 * Math.PI) -1);

    if (this.shape === 'sine') return wave;

    if (this.shape === 'square') return Number(this.on); 

    if (this.shape === 'PULSE') {
      return this.waveNums[this.index];
    }
  }
}
