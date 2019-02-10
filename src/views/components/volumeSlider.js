import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Howler } from 'howler';
import { withStyles } from '@material-ui/core';
import MicIcon from '@material-ui/icons/VolumeUp';
import MicOffIcon from '@material-ui/icons/VolumeMute';
import Paper from '@material-ui/core/Paper/Paper';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 2,
    height: 200,
    display: 'flex',
    flexDirection: 'col',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px`,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class VolumeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMuted: false,
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
      <Paper className={classes.paper}>
        <Slider
          value={volume}
          vertical={true}
          onChange={this.handleSeekerChange}
          onDragEnd={this.handleSeekerEnd}
        />
        <IconButton onClick={this.handleToggle}>
          {this.state.isMuted ? <MicOffIcon/> : <MicIcon/>}
        </IconButton>
      </Paper>
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
