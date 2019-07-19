import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Howler } from 'howler';
import { withStyles } from '@material-ui/core';
import MicIcon from '@material-ui/icons/VolumeUp';
import MicOffIcon from '@material-ui/icons/VolumeMute';
import Paper from '@material-ui/core/Paper/Paper';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
  slider: {
    marginTop: theme.spacing(2),
    height: 200,
    width: 55,
    display: 'flex',
    flexDirection: 'col',
    padding: `${theme.spacing(2)}px`
  },
  button: {
    backgroundColor: '#fff'
  }
});

function VolumeSlider(props) {
  const { volume, classes } = props;
  const [isMuted, setIsMuted] = useState(false);
  const [localVolume, setLocalVolume] = useState(volume);

  function handleToggle() {
    Howler.mute(!isMuted);
    setIsMuted(!isMuted);
  }

  function handleSeekerChange(e, val) {
    const newVolume = val / 100;
    setLocalVolume(newVolume);
    Howler.volume(newVolume);
  }

  function handleSeekerEnd(e, val) {
    props.storeVolume(val);
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.slider}>
            <Slider
              value={localVolume * 100}
              orientation="vertical"
              onChange={handleSeekerChange}
              onChangeCommitted={handleSeekerEnd}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Fab color="primary" aria-label="Add"
               onClick={handleToggle} href={''}>
            {isMuted ? <MicOffIcon/> : <MicIcon/>}
          </Fab>
        </Grid>
      </Grid>
    </div>
  );
}

VolumeSlider.propTypes = {
  classes: PropTypes.object,
  storeVolume: PropTypes.func,
  volume: PropTypes.number
};

export default compose(
  withStyles(styles)
)(VolumeSlider);
