export default class LFO {
  constructor(frequency) {
    this.frequency = frequency;
  }

  getVoltage() {
    return (Math.sin(Date.now()/1000 * this.frequency) + 1)/2;
  }
}
