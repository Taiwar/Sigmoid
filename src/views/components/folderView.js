import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DirItem from './dirItem';
import SongItem from './songItem';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { List as VirtualizedList } from "react-virtualized";
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import Grid from '@material-ui/core/Grid';
import ParentIcon from '@material-ui/icons/ArrowUpwardRounded';
import Fab from '@material-ui/core/Fab';


const useStyles =  makeStyles(theme => ({
  item: {
    borderBottom: '1px solid #999999'
  },
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  folderList: {
    height: 'calc(100vh - 210px)',
    overflow: 'hidden'
  },
  highlightBox: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    padding: theme.spacing(),
    backgroundColor: '#444',
    color: '#eee'
  },
  search: {
    position: 'relative',
    color: theme.palette.common.white,
    backgroundColor: '#444',
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    width: '100%',
  },
}));


function FolderView(props) {
  const classes = useStyles();
  const { directoryInfo, onPlay } = props;
  const [currentPath, setCurrentPath] = useState({
    root: directoryInfo.root,
    slice: directoryInfo.tree,
    parent: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Refresh widget if directoryTree changes
  useEffect(() => {
    setCurrentPath({
      root: directoryInfo.root,
      slice: directoryInfo.tree,
      parent: null
    })
  }, [directoryInfo]);

  let listItems = [];

  if (currentPath.slice && currentPath.slice.items !== undefined) {
    if (searchTerm && searchTerm !== '') {
      const sorted = directoryInfo.itemIndex.sort((a, b) => {
        if (a.type !== 'dir' && b.type === 'dir') return 1;
        if (a.type === 'dir' && b.type === 'dir') return 0;
        if (a.type === 'dir' && b.type !== 'dir') return -1;
        return 0;
      });
      listItems = sorted.filter(item => item.name.toLocaleLowerCase().match(`.*${searchTerm.toLocaleLowerCase()}`));
    } else {
      const sorted = currentPath.slice.items.sort((a, b) => {
        if (a.type !== 'dir' && b.type === 'dir') return 1;
        if (a.type === 'dir' && b.type === 'dir') return 0;
        if (a.type === 'dir' && b.type !== 'dir') return -1;
        return 0;
      });
      listItems = sorted;
    }
  }

  function renderItem({index, key, style}) {
    const item = listItems[index];
    return item.type === 'dir' ? (<DirItem
      style={style}
      key={key}
      dir={item}
      onOpen={() => setCurrentPath({
        root: item.path,
        slice: currentPath.slice.items.filter(i => i.path === item.path)[0]
      })}
    />) : (
      <SongItem
        style={style}
        key={item.path}
        song={item}
        onPlay={onPlay}
      />);
  }

  return (
    <Paper className={classes.root}>
      <Grid container justify="space-between" className={classes.highlightBox}>
        <Grid item>
          <Typography variant="h6" component="h6">
            {currentPath.root}
          </Typography>
        </Grid>
        {
          currentPath.slice.parent ? <Grid item className={classes.fabItem}>
            <Fab
              size="small"
              color="primary"
              aria-label="Parent folder"
              onClick={() => setCurrentPath({
                root: currentPath.slice.parent.path,
                slice: currentPath.slice.parent
              })}
              href="">
            <ParentIcon/>
          </Fab>
          </Grid> : <div/>
        }
      </Grid>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Global search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
      <div className={classes.folderList}>
        <AutoSizer>
          {
            ({ width, height }) => {
              return <VirtualizedList
                width={width}
                height={height}
                rowHeight={75}
                rowRenderer={renderItem}
                rowCount={listItems.length}
                overscanRowCount={3}
                noRowsRenderer={() => <div style={{padding: 20}}>Nothing to see here (ຈ ﹏ ຈ)</div>}/>
            }
          }
        </AutoSizer>
      </div>
    </Paper>
  );
}


FolderView.propTypes = {
  directoryInfo: PropTypes.object,
  onPlay: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  directoryInfo: state.audio.directoryInfo
});

const mapDispatchToProps = {
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(FolderView);
