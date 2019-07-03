export default class LFO {
  constructor(name, rate, shape) {
    this.name = name;
    this.rate = rate;
    this.shape = shape;

    // some real nice jank here boyz, the "coffin square wav"
    this.on = false; 
    setInterval(() => {this.on  = !this.on}, this.rate);
  }

  getVoltage() {
    let secondsElapsed = (Date.now() - this.startTime) / 1000;
    let wave = -0.5 * (Math.cos(secondsElapsed * this.rate * 2 * Math.PI) -1);

    if (this.shape === 'sine') return wave;

    if (this.shape === 'square') return Number(this.on); 
  }
}
