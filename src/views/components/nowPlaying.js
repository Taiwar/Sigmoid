import React, { useEffect, useState } from 'react';
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

function NowPlaying(props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [duration, setDuration] = useState(0);
  const [intervalHandle, setIntervalHandle] = useState(null);
  const {
    howl, song, classes, onNext, onPrev, onToggle
  } = props;

  useEffect(() => {
    if (intervalHandle) {
      clearInterval(intervalHandle);
    }
    const interval = setInterval(() => {
      if (howl != null) {
        if (duration !== howl.duration()) {
          setDuration(howl.duration());
        }
        if (isPlaying) {
          const songProgress = howl.seek();
          setCompleted(songProgress);
        }
      }
    }, 1000);
    setIntervalHandle(interval);
    return () => clearInterval(intervalHandle);
  }, [howl]);

  if (song == null || howl == null) {
    return (<div/>);
  }

  function handleSeekerChange(e, val) {
    if (intervalHandle) {
      clearInterval(intervalHandle);
      setIntervalHandle(null);
    }
    // If steps are larger == Slider has been clicked on, not just slided so change immediately
    // TODO: See if this can be done more elegantly
    if (Math.abs(val - completed) > 5) {
      howl.seek(completed);
    }
    setCompleted(val);
  }

  function handleSeekerEnd() {
    howl.seek(completed);
    if (intervalHandle) {
      clearInterval(intervalHandle);
    }
    const interval = setInterval(() => {
      if (howl != null) {
        if (duration === 0) {
          setDuration(howl.duration());
        }
        if (isPlaying) {
          const songProgress = howl.seek();
          setCompleted(songProgress);
        }
      }
    }, 1000);
    setIntervalHandle(interval);
  }

  function seekerText(value) {
    const mins = Math.floor(value / 60);
    const secs =  Math.floor(value % 60);
    return `${mins}:${secs > 9 ? secs : '0' + secs}`;
  }

  howl.once('play', () => setIsPlaying(true));
  howl.once('pause', () => setIsPlaying(false));

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
                {isPlaying ? <PauseIcon/> : <PlayIcon/>}
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
              defaultValue={0}
              getAriaValueText={seekerText}
              valueLabelFormat={seekerText}
              aria-labelledby="Time seeker slider"
              valueLabelDisplay="auto"
              step={1}
              min={0}
              marks={[{value: 0, label: seekerText(0)}, {value: duration, label: seekerText(duration)}]}
              max={duration}
              value={typeof completed === 'object' ? 0 : completed}
              onChange={handleSeekerChange}
              onChangeCommitted={handleSeekerEnd}
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
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
