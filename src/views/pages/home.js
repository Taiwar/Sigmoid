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
import { discordOperations } from '../../state/features/discord';
import {
  NowPlaying, Playlist, Library, VolumeSlider
} from '../components';
import FolderView from '../components/folderView';

const { globalShortcut } = require('electron').remote;

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
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`
  },
  library: {
    maxHeight: 500,
    overflow: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`
  }
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
    this.handleToggle = this.handleToggle.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

  componentDidMount() {
    this.props.initRpc();

    if (!globalShortcut.isRegistered('mediaplaypause')) {
      globalShortcut.register('mediaplaypause', this.handleToggle);
    }

    if (!globalShortcut.isRegistered('medianexttrack')) {
      globalShortcut.register('medianexttrack', this.handleNext);
    }

    if (!globalShortcut.isRegistered('mediaprevioustrack')) {
      globalShortcut.register('mediaprevioustrack', this.handlePrev);
    }

  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.playlist !== this.state.playlist) {
      const first = this.state.playlist.find(song => song.index === 1);
      if (first && first !== this.state.currentSong) {
        if (prevState.howl) prevState.howl.stop();
        if (this.state.howl) this.state.howl.stop();
        const sound = new Howl({
          src: [first.path]
        });
        sound.on('end', this.handleNext);
        Howler.volume(this.props.volume / 100);

        this.props.setPresence(this.props.rpc, {
          details: first.name,
          state: 'Listening',
          largeImageKey: 'sigmoid_large',
          largeImageText: 'Sigmoid',
          startTimestamp: new Date()
        });

        sound.play();
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          howl: sound,
          currentSong: first
        });
      }
    }
  }

  componentWillUnmount() {
    this.state.howl.stop();
    this.props.rpc.destroy();
    globalShortcut.unregister('mediaplaypause');
    globalShortcut.unregister('medianexttrack');
    globalShortcut.unregister('mediaprevioustrack');
  }

  handleOnDrop(files, event) {
    event.preventDefault();
    Object.keys(files)
      .forEach((key) => {
        if (files[key].type === 'audio/mp3') {
          this.props.onAdd(files[key]);
        }
      });
  }

  // TODO: This is still very broken
  handleOnPlaylistPlay(song) {
    if (song !== this.state.currentSong) {
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
  }

  handleOnLibraryPlay(song) {
    if (this.state.playlist.includes(song)) return;
    const enqueued = this.state.playlist.filter(s => s.index > 0);
    song.index = enqueued.length + 1;
    this.setState({
      playlist: [...this.state.playlist, song]
    });
  }

  handleToggle() {
    if (this.state.howl.playing()) {
      this.state.howl.pause();
    } else {
      this.state.howl.play();
    }
  }

  handlePrev() {
    return this.handleOnPlaylistPlay(this.state.playlist.find(song => song.index === -1));
  }

  handleNext() {
    return this.handleOnPlaylistPlay(this.state.playlist.find(song => song.index === 2));
  }

  render() {
    const {
      volume, onStoreVolume, library, classes
    } = this.props;

    return (
      <div className={classes.main}>
        <NowPlaying
          song={this.state.currentSong}
          howl={this.state.howl}
          onNext={this.handleNext}
          onPrev={this.handlePrev}
          onToggle={this.handleToggle}
        />
        <Grid container spacing={8}>
          <Grid item xs={1}>
            <VolumeSlider volume={volume} storeVolume={onStoreVolume}/>
          </Grid>
          <Grid item xs={7}>
            <FolderView onPlay={this.handleOnLibraryPlay}/>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.playlist}>
              <FileDrop onDrop={(files, event) => this.handleOnDrop(files, event)}>
                <Typography component='h2'>Playlist</Typography>
                <Playlist
                  playlist={this.state.playlist}
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
  library: PropTypes.array,
  volume: PropTypes.number,
  rpc: PropTypes.object,
  initRpc: PropTypes.func,
  setPresence: PropTypes.func,
  onAdd: PropTypes.func,
  onStoreVolume: PropTypes.func
};

Home.defaultProps = {
  library: []
};

const mapStateToProps = state => ({
  library: state.audio.library,
  volume: state.audio.volume,
  rpc: state.discord.rpc
});

const mapDispatchToProps = {
  onAdd: audioOperations.addSongToLibrary,
  onStoreVolume: audioOperations.setVolume,
  initRpc: discordOperations.init,
  setPresence: discordOperations.setPresence
};

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
