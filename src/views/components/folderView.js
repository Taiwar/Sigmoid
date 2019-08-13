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
    height: 'calc(100vh - 300px)',
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
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    padding: theme.spacing(1),
    backgroundColor: '#555'
  },
}));


function FolderView(props) {
  const classes = useStyles();
  const { directoryInfo, onPlay, onShuffle } = props;
  const [currentPath, setCurrentPath] = useState({
    root: directoryInfo.root,
    branch: directoryInfo.tree,
    parent: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Refresh widget if directoryTree changes
  useEffect(() => {
    setCurrentPath({
      root: directoryInfo.root,
      branch: directoryInfo.tree,
      parent: null
    })
  }, [directoryInfo]);

  let listItems = [];

  if (currentPath.branch && currentPath.branch.items !== undefined) {
    if (searchTerm && searchTerm !== '') {
      const sorted = directoryInfo.itemIndex.sort((a, b) => {
        if (a.type !== 'dir' && b.type === 'dir') return 1;
        if (a.type === 'dir' && b.type === 'dir') return 0;
        if (a.type === 'dir' && b.type !== 'dir') return -1;
        return 0;
      });
      listItems = sorted.filter(item => item.name.toLocaleLowerCase().match(`.*${searchTerm.toLocaleLowerCase()}`));
    } else {
      const sorted = currentPath.branch.items.sort((a, b) => {
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
        branch: currentPath.branch.items.filter(i => i.path === item.path)[0]
      })}
      onShuffle={onShuffle}
    />) : (
      <SongItem
        style={style}
        key={item.path}
        song={item}
        onPlay={onPlay}
      />);
  }

  function handleGoToParent() {
    // TODO: Only works for windows
    const pathFolders = currentPath.root.split('\\');
    const parentPath = pathFolders.slice(0, -1).join('\\');
    const parentBranch = directoryInfo.itemIndex.filter(item => item.path === parentPath)[0];
    if (parentBranch) {
      setCurrentPath({
        root: parentPath,
        branch: parentBranch
      });
    }
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
          currentPath.root.split('\\').length > 1 ? <Grid item className={classes.fabItem}>
            <Fab
              size="small"
              color="primary"
              aria-label="Parent folder"
              onClick={() => handleGoToParent()}
              href="">
              <ParentIcon/>
            </Fab>
          </Grid> : <div/>
        }
      </Grid>
      <Grid container className={classes.search}>
        <Grid item xs={1}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
        </Grid>
        <Grid item xs={11}>
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
        </Grid>
      </Grid>
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
  onPlay: PropTypes.func.isRequired,
  onShuffle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  directoryInfo: state.audio.directoryInfo
});

const mapDispatchToProps = {
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(FolderView);
