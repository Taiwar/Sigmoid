import React, { Component } from 'react';
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

class DirItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onOpen(this.props.dir);
  }

  render() {
    const { classes, dir } = this.props;

    return (
      <ListItem className={classes.item} dense button onClick={this.handleClick} component="li">
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText
          primary={dir.name}
        />
      </ListItem>
    );
  }
}

DirItem.propTypes = {
  dir: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(DirItem);
