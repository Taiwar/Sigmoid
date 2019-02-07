import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import List from '@material-ui/core/List/List';
import SongItem from './songItem';

const styles = {

};

class Library extends Component {
  render() {
    const { onPlay, library } = this.props;

    const items = library.map(song => (
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

Library.propTypes = {
  library: PropTypes.array.isRequired,
  onPlay: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(Library);
