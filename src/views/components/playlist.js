import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import List from '@material-ui/core/List/List';
import SongItem from './songItem';

const styles = {

};

class Playlist extends Component {
  render() {
    const { onPlay, playlist } = this.props;

    const items = playlist.map(song => (
      <SongItem
        key={song.path}
        song={song}
        onPlay={onPlay}
      />
    ));

    return (
      <List>
        {items}
      </List>
    );
  }
}

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  onPlay: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(Playlist);
