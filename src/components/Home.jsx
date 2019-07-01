import React from 'react';
import AudioObject from '../utils/AudioObject';
import ChanceAudio from '../utils/ChanceAudio';
import LFO from '../utils/LFO';
import axios from 'axios';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {style: {}, title: ''};
  }

  async componentDidMount() {
    this.lfo = new LFO(1);
    const config = await this.getJson(this.props.url);
    this.setState({title: config.title});

    this.elements = config.elements.map((element) => {
      const props = {...element.options, lfo: this.lfo}
      if (element.type === "chance")
        return new ChanceAudio(props);
      if (element.type === "loop")
        return new AudioObject(props);
    });
  }

  async getJson(url) {
    const response = await axios.get(url);
    return response.data;
  }

  handleClick() {
      this.elements.forEach(el => el.activate());
      this.setState({style: {color: "#db3236"}});
  }

  render() {
    return (
      <div>

        <div id="nav">
          <img id="logo" src="logo.png" />
          <h3>{this.state.title}</h3>
        </div>

        <div id="content">
          <h1 style={this.state.style} onClick={() => this.handleClick()}>generate</h1>
        </div>

      </div>
    )
  }
}
