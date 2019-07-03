import React from 'react';
import Swimmer from '../utils/Swimmer';
import LFO from '../utils/LFO';
import axios from 'axios';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {style: {}, title: ''};
  }

  async componentDidMount() {
    const config = await this.getJson(this.props.url); 
    this.setState({title: config.title});

    let allLfos = config.lfos.map((lfo) => {
      return new LFO(lfo.lfoName, lfo.rate, lfo.shape);
    });

    this.swimmers = config.swimmers.map((swimmer) => {

      const props = {
        parameters: swimmer.parameters, 
        modMatrix: swimmer.modMatrix ? swimmer.modMatrix : null, 
        lfos: allLfos
      }
      
      return new Swimmer(props);
    });
  }

  async getJson(url) {
    const response = await axios.get(url);
    return response.data;
  }

  handleClick() {
      this.swimmers.forEach(el => el.activate());
      this.setState({style: {color: "#db3236"}});
  }

  render() {
    return (
      <div>

        <div id="nav">
          <img id="logo" src="logo.png" alt=""/>
          <h3>{this.state.title}</h3>
        </div>

        <div id="content">
          <h1 style={this.state.style} onClick={() => this.handleClick()}>generate</h1>
        </div>

      </div>
    )
  }
}
