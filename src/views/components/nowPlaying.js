import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Grid from '@material-ui/core/Grid/Grid';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 3}px`,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class NowPlaying extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: true,
      completed: 0,
      interval: null
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    const interval = setInterval(() => {
      if (this.props.howl != null && this.state.isPlaying) {
        this.setState({
          completed: (this.props.howl.seek() / this.props.howl.duration()) * 100
        });
      }
    }, 1000);
    this.setState({
      interval
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  handleToggle(e) {
    e.preventDefault();
    if (this.props.howl.playing()) {
      this.props.howl.pause();
      this.setState({
        isPlaying: false
      });
    } else {
      this.props.howl.play();
      this.setState({
        isPlaying: true
      });
    }
  }

  render() {
    const { song, classes } = this.props;

    if (song == null) {
      return (<div/>);
    }

    return (
      <Paper className={classes.paper}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography component="h2">{song.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <IconButton onClick={this.handleToggle}>
              {this.state.isPlaying ? <PauseIcon/> : <PlayIcon/>}
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={this.state.completed} />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

NowPlaying.propTypes = {
  howl: PropTypes.object,
  song: PropTypes.object,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(NowPlaying);
