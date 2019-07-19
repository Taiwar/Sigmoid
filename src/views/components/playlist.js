import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import List from '@material-ui/core/List/List';
import PlaylistItem from './playlistItem';
import Paper from '@material-ui/core/Paper';
import FileDrop from 'react-file-drop';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  playlistContainer: {
    maxHeight: 500,
    marginTop: theme.spacing(2),
  },
  playlist: {
    marginBottom: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'scroll'
  },
  highlightBox: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    padding: theme.spacing(),
    backgroundColor: '#444',
    color: '#eee'
  }
});

function Playlist(props) {

  function handleDrop(files, e) {
    e.preventDefault();
    Object.keys(files)
      .forEach((key) => {
        if (files[key].type === 'audio/mp3') {
          props.onAdd(files[key]);
        }
      });
  }

  const { onPlay, playlist, classes } = props;
  const sorted = playlist.sort((a, b) => {
    if (a.index < b.index) return -1;
    if (a.index > b.index) return 1;
    return 0;
  });

  const items = sorted.map(song => (
    <PlaylistItem
      key={song.path}
      song={song}
      onPlay={onPlay}
    />
  ));

  return (
    <Paper className={classes.playlistContainer}>
      <FileDrop onDrop={(files, event) => handleDrop(files, event)}>
        <Typography className={classes.highlightBox} component="h6" variant="h6">Playlist</Typography>
        <List className={classes.playlist} component="ul">
          {items}
        </List>
      </FileDrop>
    </Paper>
  );
}

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  onPlay: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(Playlist);
