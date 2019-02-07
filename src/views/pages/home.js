import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Paper from '@material-ui/core/Paper/Paper';
import FileDrop from 'react-file-drop';
import { Howl } from 'howler';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import { audioOperations } from '../../state/features/audio';
import { NowPlaying, Playlist } from '../components';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    flexDirection: 'row',
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
      currentSong: null
    };
    this.handleOnPlay = this.handleOnPlay.bind(this);
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
    sound.volume(0.2);

    if (this.state.howl != null) {
      this.state.howl.stop();
    }

    this.setState({
      howl: sound,
      currentSong: song
    });

    sound.play();
  }

  render() {
    const { library, playlist, classes } = this.props;

    return (
      <div className={classes.main}>
        <NowPlaying
          song={this.state.currentSong}
          howl={this.state.howl}
          onNext={() => {}}
          onPrev={() => {}}
        />
        <Grid container spacing={8}>
          <Grid item xs={8}>
            <Paper className={classes.library}>
              <Typography component='h2'>Library</Typography>
              <Playlist
                playlist={library}
                onPlay={this.handleOnPlay}
              />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.playlist}>
              <FileDrop onDrop={(files, event) => this.handleOnDrop(files, event)}>
                <Typography component='h2'>Playlist</Typography>
                <Playlist
                  playlist={playlist}
                  onPlay={this.handleOnPlay}
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
  onAdd: PropTypes.func
};

Home.defaultProps = {
  playlist: [],
  library: []
};

const mapStateToProps = state => ({
  playlist: state.audio.playlist,
  library: state.audio.library
});

const mapDispatchToProps = {
  onAdd: audioOperations.addSongToPlaylist
};

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
