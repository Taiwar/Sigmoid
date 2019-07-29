import React  from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const styles = {
  item: {
    borderBottom: '1px solid #999999'
  },
};

function DirItem(props) {

  function handleClick(e) {
    e.preventDefault();
    props.onOpen(props.dir);
  }

  const { classes, dir, style } = props;

  return (
    <ListItem className={classes.item} dense button onClick={handleClick} component="li" style={style}>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText
        primary={dir.name}
      />
    </ListItem>
  );
}

DirItem.propTypes = {
  dir: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  classes: PropTypes.object,
  style: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles)
)(DirItem);
