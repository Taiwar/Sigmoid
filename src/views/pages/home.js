import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Paper from '@material-ui/core/Paper/Paper';
import FileDrop from 'react-file-drop';
import { Howl, Howler } from 'howler';
import Typography from '@material-ui/core/Typography/Typography';
import { audioOperations } from '../../state/features/audio';
import { NowPlaying, Playlist } from '../components';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      howl: null,
      currentSong: null
    };
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnToggle = this.handleOnToggle.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    Howler.volume(0.2);
  }

  handleOnDrop(files, event) {
    event.preventDefault();
    Object.keys(files).forEach((key) => {
      if (files[key].type === 'audio/mp3') {
        this.props.onAdd(files[key]);
      }
    });
  }

  handleOnPlay(song) {
    const sound = new Howl({
      src: [song.path]
    });

    if (this.state.howl != null) {
      this.state.howl.stop();
    }

    this.setState({
      howl: sound,
      currentSong: song
    });

    sound.play();
  }

  handleOnToggle() {
    if (this.state.howl.playing()) {
      this.state.howl.pause();
    } else {
      this.state.howl.play();
    }
  }

  render() {
    const { playlist, classes } = this.props;

    return (
      <div className={classes.main}>
        <NowPlaying
          song={this.state.currentSong}
          howl={this.state.howl}
          onNext={() => {}}
          onPrev={() => {}}
        />
        <Paper className={classes.paper}>
          <FileDrop onDrop={(files, event) => this.handleOnDrop(files, event)}>
            <Typography component='h2'>Drop some audio files here!</Typography>
            <Playlist
              playlist={playlist}
              onPlay={this.handleOnPlay}
            />
          </FileDrop>
        </Paper>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  playlist: PropTypes.array,
  history: PropTypes.object,
  onPlay: PropTypes.func,
  onAdd: PropTypes.func
};

Home.defaultProps = {
  playlist: []
};

const mapStateToProps = state => ({
  playlist: state.audio.playlist
});

const mapDispatchToProps = {
  onAdd: audioOperations.addSong
};

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
