import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { audioOperations } from '../../state/features/audio';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
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
    marginBottom: theme.spacing(2)
  },
  folderList: {
    maxHeight: 800,
    overflowY: "scroll"
  },
  highlightBox: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    padding: theme.spacing(),
    backgroundColor: '#444',
    color: '#eee'
  }
});


function FolderView(props) {
  const { classes, directoryTree, onPlay } = props;
  const [currentPath, setCurrentPath] = useState({
    root: directoryTree.root,
    slice: directoryTree.tree,
    parent: null
  });

  useEffect(() => {
    setCurrentPath({
      root: directoryTree.root,
      slice: directoryTree.tree,
      parent: null
    })
  }, [directoryTree]);

  let listItems = null;

  if (currentPath.slice && currentPath.slice.items !== undefined) {
    const sorted = currentPath.slice.items.sort((a, b) => {
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      if (a.type === 'dir' && b.type === 'dir') return 0;
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      return 0;
    });
    listItems = sorted.map(item => item.type === 'dir' ? (<DirItem
        key={item.path}
        dir={item}
        onOpen={() => setCurrentPath({
          root: item.path,
          slice: currentPath.slice.items.filter(i => i.path === item.path)[0]
        })}
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
      <Typography className={classes.highlightBox} variant="h6" component="h6">
        {currentPath.root}
      </Typography>
      <List component="ul" className={classes.folderList}>
        {
          currentPath.slice.parent ? <ListItem className={classes.item} component="li" dense button onClick={() => {
            setCurrentPath({
              root: currentPath.slice.parent.path,
              slice: currentPath.slice.parent
            });
          }}>
            <ListItemText
              primary="../"
            />
          </ListItem> : null
        }
        {listItems}
      </List>
    </Paper>
  );
}


FolderView.propTypes = {
  classes: PropTypes.object,
  directoryTree: PropTypes.object,
  onPlay: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  directoryTree: state.audio.directoryTree
});

const mapDispatchToProps = {
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(FolderView);
