export default class LFO {
  constructor(name, rate, shape) {
    this.name = name;
    this.rate = rate;

    this.on = false;

    console.log(this.rate);

    setInterval(() => {this.on  = !this.on}, this.rate);
  }

  getVoltage() {
    return Number(this.on);

    // return (Math.sin(Date.now()/1000 * this.rate) + 1) / 2;
    // console.log(Math.round((Math.sin(Date.now()/1000 * this.rate) + 1) / 2));
    // console.log(1 - Math.round((Math.sin(Date.now()/1000 * this.rate) + 1) / 2));



    
  }
}
