import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { audioOperations } from '../../state/features/audio';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import PlaylistItem from './playlistItem';
import DirItem from './dirItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SongItem from './songItem';

const path = require('path');

const styles = theme => ({
  item: {
    borderBottom: '1px solid #999999'
  },
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  }
});


function FolderView(props) {
  const { classes, directoryTree, onPlay, getTreeSlice, setDirectoryRoot } = props;

  useEffect(() => {
    getTreeSlice(directoryTree.root);
  }, [directoryTree.root]);

  let listItems = null;

  if (directoryTree.treeSlice.items !== undefined) {
    const sorted = directoryTree.treeSlice.items.sort((a, b) => {
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      if (a.type === 'dir' && b.type === 'dir') return 0;
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      return 0;
    });
    listItems = sorted.map(item => item.type === 'dir' ? (<DirItem
        key={item.path}
        dir={item}
        onOpen={() => setDirectoryRoot(item.path)}
      />) : (
        <SongItem
          key={item.path}
          song={item}
          onPlay={onPlay}
        />)
    );
  }

  // TODO: RegEx only works for Windows
  return (
    <Paper className={classes.root}>
      <Typography variant="h5" component="h3">
        {directoryTree.root}
      </Typography>
      <List component="ul">
        <ListItem className={classes.item} component="li" dense button onClick={() => {
          const newPath = path.join(directoryTree.root, '../');
          if (/([A-Z]:[/\\])(.*)/.exec(newPath)[2].length > 0) {
            setDirectoryRoot(newPath);
          }
        }}>
          <ListItemText
            primary="../"
          />
        </ListItem>
        {listItems}
      </List>
    </Paper>
  );
}


FolderView.propTypes = {
  classes: PropTypes.object,
  directoryTree: PropTypes.object,
  getTreeSlice: PropTypes.func,
  setDirectoryRoot: PropTypes.func,
  onPlay: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  directoryTree: state.audio.directoryTree
});

const mapDispatchToProps = {
  setDirectoryRoot: audioOperations.setDirectoryRoot,
  getTreeSlice: audioOperations.getTreeSlice
};

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(FolderView);
