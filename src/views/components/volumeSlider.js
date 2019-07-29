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

  function handleSeekerWheel(e) {
    if (e.deltaY < 0) {
      const increased = (localVolume * 100) + 2;
      handleSeekerChange(null, increased > 100 ? 100 : increased);
      props.storeVolume(localVolume);
    } else {
      const decreased = (localVolume) * 100 - 2;
      handleSeekerChange(null, decreased < 0 ? 0 : decreased);
      props.storeVolume(localVolume);
    }
    return false;
  }

  function handleSeekerChange(e, val) {
    const newVolume = val / 100;
    setLocalVolume(newVolume);
    Howler.volume(newVolume);
  }

  function handleSeekerEnd(e, val) {
    props.storeVolume(val / 100);
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.slider} onWheel={handleSeekerWheel}>
            <Slider
              defaultValue={localVolume * 100}
              value={localVolume * 100}
              aria-labelledby="Volume slider"
              orientation="vertical"
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => Math.floor(value) + '%'}
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
