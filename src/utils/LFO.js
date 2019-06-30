export default class LFO {
  constructor(frequency, shape) {
    this.frequency = frequency;
  }

  getVoltage() {
    return (Math.sin(Date.now()/1000 * this.frequency) + 1)/2;
  }
}
