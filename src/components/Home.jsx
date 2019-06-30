import React from 'react';
import AudioObject from '../utils/AudioObject';
import ChanceAudio from '../utils/ChanceAudio';
import axios from 'axios';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {style: {}};
  }

  async componentDidMount() {
    const config = await this.getJson(this.props.url);
    
    this.elements = config.elements.map((element) => {
      if (element.type === "chance")
        return new ChanceAudio(element.options);
      if (element.type === "loop")
        return new AudioObject(element.options);
    });
  }

  async getJson(url) {
    const response = await axios.get(url);
    return response.data;
  }

  handleClick() {
      this.elements.forEach(el => el.activate());
      this.setState({style: {color: "red"}});
  }

  render() {
    return (
      <div>
        <h1 style={this.state.style} onClick={() => this.handleClick()}>no content</h1>
      </div>
    )
  }
}
