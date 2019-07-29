import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    directoryInfo: {
      root,
      tree,
      itemIndex
    },
    library: [song],
    volume: float
}
*/

const directoryInfo = createReducer({
  root: './',
  tree: {},
  itemIndex: []
}, {
  [types.SET_DIRECTORY_ROOT]: (directoryInfo, action) => ({...directoryInfo, root: action.path}),
  [types.SET_DIRECTORY_INFO]: (directoryInfo, action) => ({...directoryInfo, tree: action.tree, itemIndex: action.itemIndex})
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
  directoryInfo: directoryInfo,
  library: libraryReducer,
  volume: volumeReducer
});
