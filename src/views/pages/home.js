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
import Grid from '@material-ui/core/Grid/Grid';
import { audioOperations } from '../../state/features/audio';
import {
  NowPlaying, Playlist, Library, VolumeSlider
} from '../components';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  playlist: {
    maxHeight: 500,
    overflow: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
  library: {
    maxHeight: 500,
    overflow: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      howl: null,
      playlist: [],
      currentSong: null
    };
    this.handleOnPlaylistPlay = this.handleOnPlaylistPlay.bind(this);
    this.handleOnLibraryPlay = this.handleOnLibraryPlay.bind(this);
  }

  componentDidUpdate() {
    const playlist = this.state.playlist;
    const first = playlist.find(song => song.index === 1);
    if (first && first !== this.state.currentSong) {
      if (this.state.howl) this.state.howl.stop();
      const sound = new Howl({
        src: [first.path]
      });
      sound.on('end', () => {
        this.handleOnPlaylistPlay(this.state.playlist.find(song => song.index === 2));
      });
      Howler.volume(this.props.volume / 100);

      this.setState({
        howl: sound,
        currentSong: first
      });

      sound.play();
    }
  }

  componentWillUnmount() {
    this.state.howl.stop();
  }

  handleOnDrop(files, event) {
    event.preventDefault();
    Object.keys(files).forEach((key) => {
      if (files[key].type === 'audio/mp3') {
        this.props.onAdd(files[key]);
      }
    });
  }

  handleOnPlaylistPlay(song) {
    const playlist = [];
    let i = 2;
    this.state.playlist.forEach((s) => {
      if (s === song) {
        s.index = 1;
      } else if (s === this.state.currentSong) {
        s.index = -1;
      } else if (s.index < 0) {
        s.index -= 1;
      } else {
        s.index = i;
        i += 1;
      }
      playlist.push(s);
    });
    this.setState({
      playlist
    });
  }

  handleOnLibraryPlay(song) {
    if (this.state.playlist.includes(song)) return;
    const enqueued = this.state.playlist.filter(s => s.index > 0);
    song.index = enqueued.length + 1;
    this.setState({
      playlist: [...this.state.playlist, song]
    });
  }

  render() {
    const {
      volume, onStoreVolume, library, classes
    } = this.props;
    const playlist = this.state.playlist;

    return (
      <div className={classes.main}>
        <NowPlaying
          song={this.state.currentSong}
          howl={this.state.howl}
          onNext={() => this.handleOnPlaylistPlay(playlist.find(song => song.index === 2))}
          onPrev={() => {}}
        />
        <Grid container spacing={8}>
          <Grid item xs={1}>
            <VolumeSlider volume={volume} storeVolume={onStoreVolume}/>
          </Grid>
          <Grid item xs={7}>
            <Paper className={classes.library}>
              <Typography component='h2'>Library</Typography>
              <Library
                library={library}
                onPlay={this.handleOnLibraryPlay}
              />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.playlist}>
              <FileDrop onDrop={(files, event) => this.handleOnDrop(files, event)}>
                <Typography component='h2'>Playlist</Typography>
                <Playlist
                  playlist={playlist}
                  onPlay={this.handleOnPlaylistPlay}
                />
              </FileDrop>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  playlist: PropTypes.array,
  library: PropTypes.array,
  history: PropTypes.object,
  onPlay: PropTypes.func,
  onAdd: PropTypes.func,
  onStoreVolume: PropTypes.func,
  volume: PropTypes.number
};

Home.defaultProps = {
  library: []
};

const mapStateToProps = state => ({
  library: state.audio.library,
  volume: state.audio.volume
});

const mapDispatchToProps = {
  onAdd: audioOperations.addSongToLibrary,
  onStoreVolume: audioOperations.setVolume
};

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
