import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    directoryTree: {
      root,
      tree
    },
    library: [song],
    volume: float
}
*/

const directoryTreeReducer = createReducer({
  root: './',
  tree: {}
}, {
  [types.SET_DIRECTORY_ROOT]: (directoryTree, action) => ({...directoryTree, root: action.path}),
  [types.SET_DIRECTORY_TREE]: (directoryTree, action) => ({...directoryTree, tree: action.tree})
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
