import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid/Grid';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import PrevIcon from '@material-ui/icons/SkipPrevious';
import NextIcon from '@material-ui/icons/SkipNext';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(2),
  },
  controls: {
    padding: 0,
    margin: theme.spacing(2) + 'px 0 0 0',
  },
  highlightBox: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    padding: theme.spacing(2),
    backgroundColor: '#444',
    color: '#eee'
  },
  progressContainer: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  }
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
        <Typography className={classes.highlightBox} component="h6" variant="h6">{song.name}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" className={classes.controls}>
              <Grid item>
                <IconButton onClick={onPrev} href={""}>
                  <PrevIcon/>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={onToggle} href={""}>
                  {this.state.isPlaying ? <PauseIcon/> : <PlayIcon/>}
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={onNext} href={""}>
                  <NextIcon/>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.progressContainer}>
              <Slider
                value={this.state.completed}
                onChange={this.handleSeekerChange}
                onChangeCommitted={this.handleSeekerEnd}
              />
            </div>
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
