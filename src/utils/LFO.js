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
    if (this.shape === 'sin') return (Math.sin(Date.now()/1000 * this.rate) + 1) / 2;

    if (this.shape === 'square') return Number(this.on); 
  }
}
