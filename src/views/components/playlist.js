import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import PlaylistItem from './playlistItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  playlistContainer: {
    marginTop: theme.spacing(2),
  },
  playlist: {
    height: 'calc(100vh - 300px)',
    overflow: 'hidden'
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

  const { onPlay, onChange, onDelete, onClear, playlist, playHistory, classes } = props;

  const handleMove = useCallback(
    (dragIndex, hoverIndex) => {
      onChange(dragIndex, hoverIndex);
    },
    [playlist],
  );

  let index = -1;
  const reversedHistory = [...playHistory].reverse();
  const historyItems = reversedHistory.map(song => {
    index++;
    return (<PlaylistItem
      key={song.path}
      song={song}
      index={(playHistory.length - index) * (-1)}
      isHistory={true}
      onPlay={onPlay}
      onMove={handleMove}
      onDelete={onDelete}
    />);
  });
  index = -1;
  const playlistItems = playlist.map(song => {
    index++;
    return (<PlaylistItem
      key={song.path}
      song={song}
      index={index}
      isHistory={false}
      onPlay={onPlay}
      onMove={handleMove}
      onDelete={onDelete}
    />);
  });

  return (
    <Paper className={classes.playlistContainer}>
      <Grid container justify="space-between" className={classes.highlightBox}>
        <Grid item>
          <Typography className={classes.highlightBox} component="h6" variant="h6">Playlist</Typography>
        </Grid>
        <Grid item>
          <Fab
            size="small"
            color="primary"
            aria-label="Parent folder"
            onClick={() => onClear()}
            href="">
            <ClearIcon />
          </Fab>
        </Grid>
      </Grid>
      <div className={classes.playlist}>
        <div className={classes.playlist}>
          {historyItems}
          {playlistItems}
        </div>
      </div>
    </Paper>
  );
}

Playlist.propTypes = {
  playlist: PropTypes.array.isRequired,
  playHistory: PropTypes.array.isRequired,
  onPlay: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(Playlist);
