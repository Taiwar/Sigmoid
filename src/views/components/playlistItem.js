import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Typography from '@material-ui/core/Typography/Typography';

const styles = {
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
    const { song } = this.props;

    return (
      <ListItem dense button onClick={this.handleClick}>
        <Typography>{song.index}</Typography>
        <ListItemText
          primary={song.name.split('.').slice(0, -1).join('.')}
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
