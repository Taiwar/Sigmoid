import React, { Component } from 'react';
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

class VolumeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMuted: false
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSeekerChange = this.handleSeekerChange.bind(this);
  }

  handleToggle() {
    Howler.mute(!this.state.isMuted);
    this.setState({
      isMuted: !this.state.isMuted
    });
  }

  handleSeekerChange(e, val) {
    Howler.volume(val / 100);
    this.props.storeVolume(val);
  }

  render() {
    const { volume, classes } = this.props;
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className={classes.slider}>
              <Slider
                value={volume}
                orientation="vertical"
                onChange={this.handleSeekerChange}
                onDragEnd={this.handleSeekerEnd}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Fab color="primary" aria-label="Add"
                 onClick={this.handleToggle} href={''}>
              {this.state.isMuted ? <MicOffIcon/> : <MicIcon/>}
            </Fab>
          </Grid>
        </Grid>
      </div>
    );
  }
}

VolumeSlider.propTypes = {
  classes: PropTypes.object,
  storeVolume: PropTypes.func,
  volume: PropTypes.number
};

export default compose(
  withStyles(styles)
)(VolumeSlider);
