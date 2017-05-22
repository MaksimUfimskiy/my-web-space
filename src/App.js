import React, { Component } from 'react';
import './App.css';
import AudioPlayerContainer from './containers/audio-container';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AudioPlayerContainer></AudioPlayerContainer>
      </div>
    );
  }
}

export default App;
