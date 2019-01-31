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
import Playlist from '../components/playlist';
import Button from '@material-ui/core/Button/Button';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  dropOnto: {
    margin: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    backgroundColor: '#aaa',

  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { howl: null };
    this.handleOnPlay = this.handleOnPlay.bind(this);
    this.handleOnStop = this.handleOnStop.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    Howler.volume(0.2);
  }

  handleOnDrop(files, event) {
    event.preventDefault();
    console.log('Dragged', files);
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
      howl: sound
    });

    sound.play();
  }

  handleOnStop() {
    this.state.howl.stop();
  }

  render() {
    const { playlist, classes } = this.props;

    return (
      <div className={classes.main}>
        <Paper className={classes.paper}>
          <FileDrop onDrop={(files, event) => this.handleOnDrop(files, event)}>
            <Typography component='h2'>Drop some audio files here!</Typography>
            <Playlist
              playlist={playlist}
              onPlay={this.handleOnPlay}
            />
          </FileDrop>
          <Button onClick={this.handleOnStop}>Stop</Button>
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
