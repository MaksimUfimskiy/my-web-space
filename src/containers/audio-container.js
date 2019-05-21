import { connect } from 'react-redux';
import { openFile } from '../actions/audio-actions';
import AudioPlayer from '../components/audio-player/audio-player';

const mapStateToProps = (state) => {
  return {
    filePath: state[0].file.path,
    fileData: state[0].file.data,
    controls: true
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOpenFile: (file) => {
      dispatch(openFile(file))
    }
  }
};

const AudioPlayerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer);

export default AudioPlayerContainer;