import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/lab/Slider';
import Grid from '@material-ui/core/Grid/Grid';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import PrevIcon from '@material-ui/icons/SkipPrevious';
import NextIcon from '@material-ui/icons/SkipNext';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 4,
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
    this.handleSeekerChange = this.handleSeekerChange.bind(this);
    this.handleSeekerEnd = this.handleSeekerEnd.bind(this);
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

  handleSeekerChange(e, val) {
    // If steps are larger == Slider has been clicked on, not just slided so change immediately
    // TODO: See if this can be done more elegantly
    if (Math.abs(val - this.state.completed) > 5) {
      this.props.howl.seek((val / 100) * this.props.howl.duration());
    }
    this.setState({
      completed: val
    });
  }

  handleSeekerEnd() {
    this.props.howl.seek((this.state.completed / 100) * this.props.howl.duration());
  }

  render() {
    const {
      howl, song, classes, onNext, onPrev, onToggle
    } = this.props;

    if (song == null || howl == null) {
      return (<div/>);
    }

    howl.once('play', () => this.setState({ isPlaying: true }));
    howl.once('pause', () => this.setState({ isPlaying: false }));

    return (
      <Paper className={classes.paper}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography component="h2">{song.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item>
                <IconButton onClick={onPrev}>
                  <PrevIcon/>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={onToggle}>
                  {this.state.isPlaying ? <PauseIcon/> : <PlayIcon/>}
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={onNext}>
                  <NextIcon/>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Slider
              value={this.state.completed}
              onChange={this.handleSeekerChange}
              onDragEnd={this.handleSeekerEnd}
            />
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
  onToggle: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(NowPlaying);
