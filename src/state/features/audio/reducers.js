import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    library: [song],
    volume: float
}
*/

const libraryReducer = createReducer([], {
  [types.SET_LIBRARY]: (library, action) => action.songs,
  [types.ADD_SONG_LIBRARY]: (library, action) => [...library, action.song],
  [types.REMOVE_SONG_LIBRARY]: (library, action) => library
    .filter(song => song.path !== action.song.path)
});

const volumeReducer = createReducer([], {
  [types.SET_VOLUME]: (volume, action) => action.volume,
});

export default combineReducers({
  library: libraryReducer,
  volume: volumeReducer
});
