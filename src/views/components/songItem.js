import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import MusicNoteIcon from '@material-ui/icons/MusicNote';

function SongItem(props) {

  function handleClick(e) {
    e.preventDefault();
    props.onPlay(props.song);
  }

  const { song, style } = props;

  return (
    <ListItem dense button onClick={handleClick} style={style}>
      <ListItemIcon>
        <MusicNoteIcon />
      </ListItemIcon>
      <ListItemText
        primary={song.name}
        secondary={song.path}
      />
    </ListItem>
  );
}

SongItem.propTypes = {
  song: PropTypes.object.isRequired,
  onPlay: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired
};

export default SongItem;
