import React from 'react';
import AudioObject from '../utils/AudioObject';
import {Howl} from 'howler';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {style: {}};
  }

  handleClick() {
      this.audio1 = new AudioObject({source: '/samples/science1.wav', loop: true, volume: 0.5});
      this.audio1.activate();
      this.audio2 = new AudioObject({source: '/samples/clap1.wav', probability: 0.5, interval: 100});
      this.setState({style: {color: "red"}});
  }

  render() {
    return (
      <div>
        <h1 style={this.state.style} onClick={() => this.handleClick()}>Generative Shit</h1>
      </div>
    )
  }
}
