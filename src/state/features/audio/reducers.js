import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    directoryTree: {
      root,
      treeSlice
    },
    library: [song],
    volume: float
}
*/

const directoryTreeReducer = createReducer({
  root: __dirname,
  treeSlice: []
}, {
  [types.SET_DIRECTORY_ROOT]: (directoryTree, action) => ({...directoryTree, root: action.path}),
  [types.SET_DIRECTORY_TREE_SLICE]: (directoryTree, action) => ({...directoryTree, treeSlice: action.treeSlice})
});

const libraryReducer = createReducer([], {
  [types.SET_LIBRARY]: (library, action) => action.songs,
  [types.ADD_SONG_LIBRARY]: (library, action) => [...library, action.song],
  [types.REMOVE_SONG_LIBRARY]: (library, action) => library
    .filter(song => song.path !== action.song.path)
});

const volumeReducer = createReducer(50.0, {
  [types.SET_VOLUME]: (volume, action) => action.volume
});

export default combineReducers({
  directoryTree: directoryTreeReducer,
  library: libraryReducer,
  volume: volumeReducer
});
