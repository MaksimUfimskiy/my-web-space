import React, {Component} from 'react';
import * as d3 from "d3";

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.frequencyData = new Uint8Array(200);
    this.svgHeight = '300';
    this.svgWidth = '1200';
    this.barPadding = '1';
    this.handleChange = this.handleChange.bind(this);
    this.renderChart = this.renderChart.bind(this);
  }
  componentDidMount() {
    const audio = this.audioEl;

    audio.addEventListener('error', (e) => {
      this.props.onError(e);
    });

    // When enough of the file has downloaded to start playing
    audio.addEventListener('canplay', (e) => {
      this.props.onCanPlay(e);
    });

    // When enough of the file has downloaded to play the entire file
    audio.addEventListener('canplaythrough', (e) => {
      this.props.onCanPlayThrough(e);
    });

    // When audio play starts
    audio.addEventListener('play', (e) => {
      this.setListenTrack();
      this.renderChart();
      this.props.onPlay(e);
    });

    // When unloading the audio player (switching to another src)
    audio.addEventListener('abort', (e) => {
      this.clearListenTrack();
      this.props.onAbort(e);
    });

    // When the file has finished playing to the end
    audio.addEventListener('ended', (e) => {
      this.clearListenTrack();
      this.props.onEnded(e);
    });

    // When the user pauses playback
    audio.addEventListener('pause', (e) => {
      this.clearListenTrack();
      this.props.onPause(e);
    });

    // When the user drags the time indicator to a new time
    audio.addEventListener('seeked', (e) => {
      this.clearListenTrack();
      this.props.onSeeked(e);
    });
    this.svg = this.createSvg('body', this.svgHeight, this.svgWidth);
    this.svg.selectAll('rect')
      .data(this.frequencyData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => {
        return i * (this.svgWidth / this.frequencyData.length);
      })
      .attr('width', this.svgWidth / this.frequencyData.length - this.barPadding);
  }
  createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }
  renderChart() {
    requestAnimationFrame(this.renderChart);
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.svg.selectAll('rect')
      .data(this.frequencyData)
      .attr('y', (d) => {
        return this.svgHeight - d;
      })
      .attr('height', (d) => {
        return d;
      })
      .attr('fill', (d) => {
        return 'rgb(0, 0, ' + d + ')';
      });
  }
  /**
   * Set an interval to call props.onListen every props.listenInterval time period
   */
  setListenTrack() {
    if (!this.listenTracker) {
      const listenInterval = this.props.listenInterval;
      this.listenTracker = setInterval(() => {
        this.props.onListen(this.audioEl.currentTime);
      }, listenInterval);
    }
  }

  /**
   * Clear the onListen interval
   */
  clearListenTrack() {
    if (this.listenTracker) {
      clearInterval(this.listenTracker);
      this.listenTracker = null;
    }
  }

  handleChange(event) {
    this.props.onOpenFile({
      path: event.target.value,
      data: window.URL.createObjectURL(event.target.files[0])
    });
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audioSrc = audioCtx.createMediaElementSource(this.audioEl);
    this.analyser = audioCtx.createAnalyser();
    this.audioSrc.connect(this.analyser);
    this.audioSrc.connect(audioCtx.destination);
  }

  render() {
    const incompatibilityMessage = this.props.children || (
        <p>Your browser does not support the <code>audio</code> element.</p>
      );
    const controls = !(this.props.controls === false);

    return(
      <div>
        <input type="file" value={this.props.filePath} accept="audio/*" onChange={this.handleChange}  />
        <audio
          autoPlay={this.props.autoPlay}
          className={`react-audio-player ${this.props.className}`}
          controls={controls}
          loop={this.props.loop}
          muted={this.props.muted}
          onPlay={this.onPlay}
          preload={this.props.preload}
          ref={(ref) => { this.audioEl = ref; }}
          src={this.props.fileData}
          style={this.props.style}
        >
          {incompatibilityMessage}
        </audio>

      </div>
    )

  }
}
AudioPlayer.defaultProps = {
  autoPlay: false,
  children: null,
  className: '',
  controls: false,
  listenInterval: 10000,
  loop: false,
  muted: false,
  onAbort: () => {},
  onCanPlay: () => {},
  onCanPlayThrough: () => {},
  onEnded: () => {},
  onError: () => {},
  onListen: () => {},
  onPause: () => {},
  onPlay: () => {},
  onSeeked: () => {},
  preload: 'metadata',

  style: {},
};

export default AudioPlayer;