import React from 'react';
import PropTypes  from 'prop-types';
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

function PlaylistItem(props) {

  function handleClick(e) {
    e.preventDefault();
    props.onPlay(props.song);
  }

  const { classes, song, style } = props;

  return (
    <ListItem
      className={song.index > 0 ? classes.item : classes.played}
      dense
      button
      onClick={handleClick}
      component="li"
      style={style}>
      <Typography>{song.index}</Typography>
      &nbsp;
      <ListItemText
        primaryTypographyProps={{noWrap: true}}
        primary={song.name}
      />
    </ListItem>
  );
}

PlaylistItem.propTypes = {
  song: PropTypes.object.isRequired,
  onPlay: PropTypes.func.isRequired,
  classes: PropTypes.object,
  style: PropTypes.object
};

export default compose(
  withStyles(styles)
)(PlaylistItem);
