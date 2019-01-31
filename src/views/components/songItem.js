import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import MusicNoteIcon from '@material-ui/icons/MusicNote';

const styles = {
};

class SongItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onPlay(this.props.song);
  }

  render() {
    const { song } = this.props;

    return (
      <ListItem dense button onClick={this.handleClick}>
        <ListItemIcon>
          <MusicNoteIcon />
        </ListItemIcon>
        <ListItemText
          primary={song.name}
          secondary={song.path}
        />
      </ListItem>
    );
  }
}

SongItem.propTypes = {
  song: PropTypes.object.isRequired,
  onPlay: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(SongItem);
