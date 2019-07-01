export default class LFO {
  constructor(name, rate) {
    this.name = name;
    this.rate = rate;
  }

  getVoltage() {
    return (Math.sin(Date.now()/1000 * this.rate) + 1) / 2;
  }
}
