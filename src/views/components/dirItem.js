import React  from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import FolderIcon from '@material-ui/icons/Folder';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  item: {
    borderBottom: '1px solid #999999'
  },
};

function DirItem(props) {

  const { classes, dir, onOpen, onShuffle, style } = props;

  function handleClick(e) {
    e.preventDefault();
    onOpen(dir);
  }

  function handleShuffle(e) {
    e.preventDefault();
    onShuffle(dir);
  }

  return (
    <ListItem
      className={classes.item}
      dense
      button
      onClick={handleClick}
      component="li"
      style={style}>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText
        primary={dir.name}
      />
      <IconButton onClick={handleShuffle} aria-label="shuffle">
        <ShuffleIcon />
      </IconButton>
    </ListItem>
  );
}

DirItem.propTypes = {
  dir: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  onShuffle: PropTypes.func.isRequired,
  classes: PropTypes.object,
  style: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles)
)(DirItem);
