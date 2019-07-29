import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import PlaylistItem from './playlistItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import { List as VirtualizedList } from 'react-virtualized';

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

  const { onPlay, playlist, classes } = props;
  const sorted = playlist.sort((a, b) => {
    if (a.index < b.index) return -1;
    if (a.index > b.index) return 1;
    return 0;
  });

  function renderItem({index, key, style}) {
    const song = sorted[index];
    return <PlaylistItem
      key={key}
      song={song}
      onPlay={onPlay}
      style={style}
    />;
  }

  return (
    <Paper className={classes.playlistContainer}>
      <Typography className={classes.highlightBox} component="h6" variant="h6">Playlist</Typography>
      <div className={classes.playlist}>
        <AutoSizer>
          {
            ({ width, height }) => {
              return <VirtualizedList
                width={width}
                height={height}
                rowHeight={50}
                rowRenderer={renderItem}
                rowCount={sorted.length}
                overscanRowCount={3}
                noRowsRenderer={() => <div style={{padding: 20}}>Waiting for something to play (◕‿◕｡)</div>}/>
            }
          }
        </AutoSizer>
      </div>
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
