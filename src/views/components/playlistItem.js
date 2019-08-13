import React, { useRef } from 'react';
import PropTypes  from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Typography from '@material-ui/core/Typography/Typography';
import ItemTypes from './itemTypes';
import { useDrag, useDrop } from 'react-dnd';
import dragIcon from './drag.svg';
import Grid from '@material-ui/core/Grid';
import { Menu, Item, MenuProvider } from 'react-contexify';


const styles = theme => ({
  item: {
    borderBottom: '1px solid #999999',
    cursor: 'pointer',
    paddingLeft: theme.spacing(0.5)
  },
  history: {
    opacity: 0.6,
    borderBottom: '1px solid #999',
    cursor: 'pointer',
    paddingLeft: theme.spacing(0.5)
  },
  draggableSpace: {
    cursor: 'move',
  }
});

function PlaylistItem(props) {
  const ref = useRef(null);
  const { classes, song, index, isHistory, onMove, onPlay, onDelete } = props;
  const [, drop] = useDrop({
    accept: ItemTypes.PLAYLIST_ITEM,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.PLAYLIST_ITEM, id: song.path, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  function handleClick() {
    onPlay(props.song);
  }

  function handleDelete() {
    onDelete(props.song);
  }

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  const menuId = `${index}_menu`;
  const SongContextMenu = () => (
    <Menu id={menuId}>
      <Item onClick={handleClick}>Play</Item>
      <Item onClick={handleDelete}>Delete</Item>
    </Menu>
  );
  // TODO: Make only the "draggableSpace" draggable
  return (
    <div ref={ref}>
      <MenuProvider id={menuId}>
        <ListItem
          className={isHistory ? classes.history : classes.item}
          styles={{opacity}}
          dense
          button
          onClick={handleClick}
          component="li"
        >
          <Grid container>
            <Grid item xs={2}>
              <Grid container className={classes.draggableSpace}>
                <Grid item>
                  <img src={dragIcon} alt="drag" />
                </Grid>
                <Grid item>
                  <Typography>{index}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={10}>
              <ListItemText
                primaryTypographyProps={{noWrap: true}}
                primary={song.name}
              />
            </Grid>
          </Grid>
        </ListItem>
      </MenuProvider>
      <SongContextMenu/>
    </div>
  );
}

PlaylistItem.propTypes = {
  song: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isHistory: PropTypes.bool.isRequired,
  onPlay: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default compose(
  withStyles(styles)
)(PlaylistItem);
