import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Typography from '@material-ui/core/Typography/Typography';

const styles = {
  item: {
    borderBottom: '1px solid #999999'
  },
  played: {
    opacity: 0.6,
    borderBottom: '1px solid #999'
  }
};

class PlaylistItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onPlay(this.props.song);
  }

  render() {
    const { classes, song } = this.props;

    return (
      <ListItem className={song.index > 0 ? classes.item : classes.played} dense button onClick={this.handleClick} component="li">
        <Typography>{song.index}</Typography>
        &nbsp;
        <ListItemText
          primary={song.name}
        />
      </ListItem>
    );
  }
}

PlaylistItem.propTypes = {
  song: PropTypes.object.isRequired,
  onPlay: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default compose(
  withStyles(styles)
)(PlaylistItem);
